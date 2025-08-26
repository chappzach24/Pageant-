// Backend/services/emailService.js
const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send application approval notification
const sendApprovalNotificationEmail = async (userEmail, userName, pageantName, pageantDetails = {}) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@pageantportal.com',
      to: userEmail,
      subject: `🎉 Application Approved - ${pageantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Congratulations!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your application has been approved</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Dear ${userName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              We're excited to inform you that your application for <strong>${pageantName}</strong> has been approved!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>You are now officially registered as a contestant</li>
                <li>Keep an eye out for further communications about event details</li>
                <li>Prepare for the competition according to the categories you selected</li>
                <li>Contact us if you have any questions or need clarification</li>
              </ul>
            </div>
            
            ${pageantDetails.eventDate ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Event Details</h3>
              <p style="color: #555; margin: 5px 0;"><strong>Date:</strong> ${pageantDetails.eventDate}</p>
              ${pageantDetails.location ? `<p style="color: #555; margin: 5px 0;"><strong>Location:</strong> ${pageantDetails.location}</p>` : ''}
              ${pageantDetails.time ? `<p style="color: #555; margin: 5px 0;"><strong>Time:</strong> ${pageantDetails.time}</p>` : ''}
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/contestant-dashboard/my-pageants" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View My Pageants
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              Best of luck in the competition!<br>
              The Pageant Portal Team
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval notification sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending approval notification email:', error);
    throw error;
  }
};

// Send application rejection notification
const sendRejectionNotificationEmail = async (userEmail, userName, pageantName, rejectionReason = '', refundInfo = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@pageantportal.com',
      to: userEmail,
      subject: `Application Update - ${pageantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6c757d; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">${pageantName}</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Dear ${userName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Thank you for your interest in <strong>${pageantName}</strong>. After careful consideration, 
              we regret to inform you that we are unable to approve your application at this time.
            </p>
            
            ${rejectionReason ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">Additional Information</h3>
              <p style="color: #555; line-height: 1.6;">${rejectionReason}</p>
            </div>
            ` : ''}
            
            ${refundInfo ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <h3 style="color: #0c5460; margin-top: 0;">Refund Information</h3>
              <p style="color: #555; line-height: 1.6;">
                A refund of $${refundInfo.amount} will be processed to your original payment method within 5-7 business days.
              </p>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">We Encourage You To:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>Check out our other upcoming pageants that might be a better fit</li>
                <li>Consider applying again for future events</li>
                <li>Contact us if you have any questions about this decision</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/contestant-dashboard/join-pageant" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Browse Other Pageants
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              Thank you for your understanding.<br>
              The Pageant Portal Team
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Rejection notification sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending rejection notification email:', error);
    throw error;
  }
};

// Send bulk approval notification
const sendBulkApprovalNotification = async (organizerEmail, organizerName, pageantName, approvedCount) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@pageantportal.com',
      to: organizerEmail,
      subject: `Bulk Approval Complete - ${pageantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Bulk Approval Complete</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">${pageantName}</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hello ${organizerName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              The bulk approval process for <strong>${pageantName}</strong> has been completed successfully.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; text-align: center;">
              <h3 style="color: #28a745; margin-top: 0; font-size: 24px;">${approvedCount}</h3>
              <p style="color: #555; margin: 0;">Applications Approved</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              All approved contestants have been notified via email and can now view their status in their dashboard.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/organization-dashboard/applications" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Applications
              </a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Bulk approval notification sent to ${organizerEmail}`);
  } catch (error) {
    console.error('Error sending bulk approval notification email:', error);
    throw error;
  }
};

// Send application status reminder to organizer
const sendApplicationReminderEmail = async (organizerEmail, organizerName, pendingCount, pageantName, deadline) => {
  try {
    const transporter = createTransporter();

    const daysUntilDeadline = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@pageantportal.com',
      to: organizerEmail,
      subject: `⏰ Pending Applications Reminder - ${pageantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ffc107; color: #212529; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">⏰ Action Required</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Pending applications need your review</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hello ${organizerName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              You have <strong>${pendingCount}</strong> pending applications for <strong>${pageantName}</strong> 
              that require your review.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">Registration Deadline</h3>
              <p style="color: #555; margin: 0;">
                <strong>${daysUntilDeadline} days remaining</strong> until registration closes
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/organization-dashboard/applications/${pageantName}" 
                 style="background: #ffc107; color: #212529; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Review Applications Now
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              Don't let great contestants slip away!
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application reminder sent to ${organizerEmail}`);
  } catch (error) {
    console.error('Error sending application reminder email:', error);
    throw error;
  }
};

module.exports = {
  sendApprovalNotificationEmail,
  sendRejectionNotificationEmail,
  sendBulkApprovalNotification,
  sendApplicationReminderEmail
};