const Participant = require('../models/Participant');
const Pageant = require('../models/Pageant');
const Organization = require('../models/Organization');
const User = require('../models/User');
const ContestantProfile = require('../models/ContestantProfile');
const Payment = require('../models/Payment');
const { validationResult } = require('express-validator');

// Import email service
const {
  sendApprovalNotificationEmail,
  sendRejectionNotificationEmail,
  sendBulkApprovalNotification
} = require('../services/emailService');

// @route   PUT /api/applications/:applicationId/approve
// @desc    Approve an application
// @access  Private
exports.approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    // Find the participant (application)
    const participant = await Participant.findById(applicationId)
      .populate({
        path: 'pageant',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      })
      .populate('user', 'firstName lastName email username');

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if user owns the organization
    if (participant.pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to approve this application'
      });
    }

    // Check if application is in a state that can be approved
    if (participant.status !== 'registered') {
      return res.status(400).json({
        success: false,
        error: 'Application cannot be approved in its current state'
      });
    }

    // Approve the application using the model method
    await participant.approve(req.user.id, notes);

    // Send approval notification email
    try {
      const userName = `${participant.user.firstName} ${participant.user.lastName}`;
      const pageantDetails = {
        eventDate: participant.pageant.startDate,
        location: participant.pageant.location?.venue ? 
          `${participant.pageant.location.venue}, ${participant.pageant.location.address?.city}, ${participant.pageant.location.address?.state}` : 
          'TBD'
      };

      await sendApprovalNotificationEmail(
        participant.user.email,
        userName,
        participant.pageant.name,
        pageantDetails
      );
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application approved successfully',
      application: {
        _id: participant._id,
        status: participant.status,
        notes: participant.notes,
        approvalDate: participant.approvalDate,
        contestant: {
          firstName: participant.user.firstName,
          lastName: participant.user.lastName,
          email: participant.user.email
        }
      }
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/applications/:applicationId/reject
// @desc    Reject an application
// @access  Private
exports.rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes, refundPayment = false, rejectionReason } = req.body;

    // Find the participant (application)
    const participant = await Participant.findById(applicationId)
      .populate({
        path: 'pageant',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      })
      .populate('user', 'firstName lastName email username');

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check if user owns the organization
    if (participant.pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to reject this application'
      });
    }

    // Check if application is in a state that can be rejected
    if (participant.status === 'disqualified') {
      return res.status(400).json({
        success: false,
        error: 'Application is already rejected'
      });
    }

    let refundInfo = null;

    // Handle refund if requested and payment was completed
    if (refundPayment && participant.paymentStatus === 'completed') {
      // Update payment status to indicate refund needed
      participant.paymentStatus = 'refunded';
      
      // Create a refund record in the payment history
      const refundPayment = new Payment({
        participant: participant._id,
        user: participant.user._id,
        pageant: participant.pageant._id,
        amount: -participant.totalPaid, // Negative amount for refund
        status: 'completed',
        method: 'stripe',
        transactionId: `refund_${participant._id}_${Date.now()}`,
        description: `Refund for rejected application - ${participant.pageant.name}`,
        metadata: {
          originalApplicationId: participant._id,
          refundReason: 'Application rejected',
          notes: notes || ''
        }
      });

      await refundPayment.save();
      
      // Add refund to payment history
      participant.paymentHistory.push(refundPayment._id);
      participant.totalRefunded = participant.totalPaid;
      participant.balanceDue = 0;

      refundInfo = {
        amount: participant.totalPaid
      };
    }

    // Reject the application using the model method
    await participant.reject(req.user.id, rejectionReason, notes);

    // Send rejection notification email
    try {
      const userName = `${participant.user.firstName} ${participant.user.lastName}`;
      
      await sendRejectionNotificationEmail(
        participant.user.email,
        userName,
        participant.pageant.name,
        rejectionReason || notes,
        refundInfo
      );
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Application rejected successfully',
      application: {
        _id: participant._id,
        status: participant.status,
        paymentStatus: participant.paymentStatus,
        notes: participant.notes,
        rejectionReason: participant.rejectionReason,
        refundProcessed: !!refundInfo,
        contestant: {
          firstName: participant.user.firstName,
          lastName: participant.user.lastName,
          email: participant.user.email
        }
      }
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/applications/bulk-approve
// @desc    Bulk approve multiple applications
// @access  Private
exports.bulkApproveApplications = async (req, res) => {
  try {
    const { applicationIds, notes } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Application IDs array is required'
      });
    }

    const results = [];
    const errors = [];
    let pageantName = '';
    let organizerName = '';

    // Get organizer info for bulk notification
    const organizer = await User.findById(req.user.id).select('firstName lastName email');
    organizerName = `${organizer.firstName} ${organizer.lastName}`;

    // Process each application
    for (const applicationId of applicationIds) {
      try {
        // Find the participant
        const participant = await Participant.findById(applicationId)
          .populate({
            path: 'pageant',
            populate: {
              path: 'organization',
              select: 'owner'
            }
          })
          .populate('user', 'firstName lastName email');

        if (!participant) {
          errors.push({ applicationId, error: 'Application not found' });
          continue;
        }

        // Set pageant name for bulk notification (from first application)
        if (!pageantName) {
          pageantName = participant.pageant.name;
        }

        // Check ownership
        if (participant.pageant.organization.owner.toString() !== req.user.id) {
          errors.push({ applicationId, error: 'Not authorized' });
          continue;
        }

        // Check status
        if (participant.status !== 'registered') {
          errors.push({ applicationId, error: 'Cannot approve application in current state' });
          continue;
        }

        // Approve the application
        await participant.approve(req.user.id, notes);

        // Send individual approval email
        try {
          const userName = `${participant.user.firstName} ${participant.user.lastName}`;
          const pageantDetails = {
            eventDate: participant.pageant.startDate,
            location: participant.pageant.location?.venue ? 
              `${participant.pageant.location.venue}, ${participant.pageant.location.address?.city}, ${participant.pageant.location.address?.state}` : 
              'TBD'
          };

          await sendApprovalNotificationEmail(
            participant.user.email,
            userName,
            participant.pageant.name,
            pageantDetails
          );
        } catch (emailError) {
          console.error('Error sending individual approval email:', emailError);
        }

        results.push({
          applicationId,
          success: true,
          contestant: `${participant.user.firstName} ${participant.user.lastName}`
        });

      } catch (error) {
        errors.push({ applicationId, error: error.message });
      }
    }

    // Send bulk approval notification to organizer
    if (results.length > 0) {
      try {
        await sendBulkApprovalNotification(
          organizer.email,
          organizerName,
          pageantName,
          results.length
        );
      } catch (emailError) {
        console.error('Error sending bulk approval notification:', emailError);
      }
    }

    res.json({
      success: true,
      message: `Bulk approval completed. ${results.length} applications approved, ${errors.length} errors.`,
      results,
      errors
    });

  } catch (error) {
    console.error('Bulk approve applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Keep all other existing methods from the original controller...
// (getPageantsWithApplications, getPageantApplications, getApplicationStats, updateApplicationNotes)

// @route   GET /api/applications/pageants
// @desc    Get all pageants with application summaries for organization owner
// @access  Private
exports.getPageantsWithApplications = async (req, res) => {
  try {
    // Get user's organizations
    const organizations = await Organization.find({ owner: req.user.id });

    if (organizations.length === 0) {
      return res.json({
        success: true,
        pageants: []
      });
    }

    const orgIds = organizations.map(org => org._id);

    // Get pageants for user's organizations
    const pageants = await Pageant.find({
      organization: { $in: orgIds }
    })
    .populate('organization', 'name')
    .sort({ registrationDeadline: 1 });

    // Get application statistics for each pageant
    const pageantSummaries = await Promise.all(
      pageants.map(async (pageant) => {
        // Get all participants for this pageant
        const participants = await Participant.find({ pageant: pageant._id });
        
        // Calculate application counts by status
        const pendingApplications = participants.filter(p => p.status === 'registered').length;
        const approvedApplications = participants.filter(p => p.status === 'confirmed').length;
        const rejectedApplications = participants.filter(p => p.status === 'disqualified').length;
        const totalApplications = participants.length;

        // Calculate days until deadline
        const now = new Date();
        const deadline = new Date(pageant.registrationDeadline);
        const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        return {
          _id: pageant._id,
          name: pageant.name,
          pageantID: pageant.pageantID,
          startDate: pageant.startDate,
          endDate: pageant.endDate,
          registrationDeadline: pageant.registrationDeadline,
          entryFee: pageant.entryFee,
          location: pageant.location,
          status: pageant.status,
          organization: pageant.organization,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          totalApplications,
          daysUntilDeadline
        };
      })
    );

    res.json({
      success: true,
      pageants: pageantSummaries
    });
  } catch (error) {
    console.error('Get pageants with applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/applications/pageant/:pageantId
// @desc    Get all applications for a specific pageant
// @access  Private
exports.getPageantApplications = async (req, res) => {
  try {
    const { pageantId } = req.params;

    // Check if pageant exists and user owns it
    const pageant = await Pageant.findById(pageantId)
      .populate('organization', 'owner name');

    if (!pageant) {
      return res.status(404).json({
        success: false,
        error: 'Pageant not found'
      });
    }

    // Check if user owns the organization
    if (pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view applications for this pageant'
      });
    }

    // Get all participants (applications) for this pageant
    const participants = await Participant.find({ pageant: pageantId })
      .populate({
        path: 'user',
        select: 'username firstName lastName email dateOfBirth phone'
      })
      .populate({
        path: 'contestantProfile',
        select: 'biography funFact emergencyContact medicalInformation'
      })
      .populate({
        path: 'paymentHistory',
        select: 'amount status paymentDate transactionId'
      })
      .sort({ registrationDate: -1 });

    // Format applications data
    const applications = participants.map(participant => ({
      _id: participant._id,
      contestant: {
        _id: participant.user._id,
        firstName: participant.user.firstName,
        lastName: participant.user.lastName,
        email: participant.user.email,
        username: participant.user.username,
        dateOfBirth: participant.user.dateOfBirth,
        ageGroup: participant.ageGroup,
        phone: participant.user.phone || 'Not provided'
      },
      profile: {
        biography: participant.contestantProfile?.biography || '',
        emergencyContact: participant.contestantProfile?.emergencyContact || {},
        medicalInformation: participant.contestantProfile?.medicalInformation || {}
      },
      categories: participant.categories.map(cat => cat.category),
      appliedAt: participant.registrationDate,
      status: participant.status,
      paymentStatus: participant.paymentStatus,
      paymentAmount: participant.paymentAmount,
      totalPaid: participant.totalPaid,
      photos: participant.photos,
      notes: participant.notes || '',
      rejectionReason: participant.rejectionReason || '',
      approvalDate: participant.approvalDate,
      applicationReviewedAt: participant.applicationReviewedAt,
      paymentHistory: participant.paymentHistory
    }));

    res.json({
      success: true,
      pageant: {
        _id: pageant._id,
        name: pageant.name,
        pageantID: pageant.pageantID,
        startDate: pageant.startDate,
        endDate: pageant.endDate,
        registrationDeadline: pageant.registrationDeadline,
        entryFee: pageant.entryFee,
        location: pageant.location,
        categories: pageant.categories,
        ageGroups: pageant.ageGroups,
        status: pageant.status
      },
      applications
    });
  } catch (error) {
    console.error('Get pageant applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   GET /api/applications/stats
// @desc    Get application statistics for organization owner
// @access  Private
exports.getApplicationStats = async (req, res) => {
  try {
    // Get user's organizations
    const organizations = await Organization.find({ owner: req.user.id });
    const orgIds = organizations.map(org => org._id);

    // Get pageants for user's organizations
    const pageants = await Pageant.find({
      organization: { $in: orgIds }
    });
    const pageantIds = pageants.map(p => p._id);

    // Get all participants for user's pageants
    const participants = await Participant.find({
      pageant: { $in: pageantIds }
    });

    // Calculate statistics
    const totalApplications = participants.length;
    const pendingApplications = participants.filter(p => p.status === 'registered').length;
    const approvedApplications = participants.filter(p => p.status === 'confirmed').length;
    const rejectedApplications = participants.filter(p => p.status === 'disqualified').length;

    // Calculate urgent pageants (deadline within 7 days)
    const now = new Date();
    const urgentPageants = pageants.filter(pageant => {
      const deadline = new Date(pageant.registrationDeadline);
      const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil > 0;
    }).length;

    const activePageants = pageants.filter(p => 
      p.status === 'published' && new Date(p.registrationDeadline) > now
    ).length;

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        urgentPageants,
        activePageants,
        totalPageants: pageants.length
      }
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   PUT /api/applications/:applicationId/update-notes
// @desc    Update application notes
// @access  Private
exports.updateApplicationNotes = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    // Find the participant
    const participant = await Participant.findById(applicationId)
      .populate({
        path: 'pageant',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check ownership
    if (participant.pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this application'
      });
    }

    // Update notes
    participant.notes = notes || '';
    await participant.save();

    res.json({
      success: true,
      message: 'Application notes updated successfully',
      notes: participant.notes
    });

  } catch (error) {
    console.error('Update application notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @route   POST /api/applications/:applicationId/add-communication
// @desc    Add a communication note to an application
// @access  Private
exports.addCommunicationNote = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { type, content } = req.body;

    // Validate input
    if (!type || !content) {
      return res.status(400).json({
        success: false,
        error: 'Type and content are required'
      });
    }

    // Find the participant
    const participant = await Participant.findById(applicationId)
      .populate({
        path: 'pageant',
        populate: {
          path: 'organization',
          select: 'owner'
        }
      });

    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check ownership
    if (participant.pageant.organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add communication notes to this application'
      });
    }

    // Add communication note
    await participant.addCommunicationNote(type, content, req.user.id);

    res.json({
      success: true,
      message: 'Communication note added successfully',
      communicationNotes: participant.communicationNotes
    });

  } catch (error) {
    console.error('Add communication note error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};