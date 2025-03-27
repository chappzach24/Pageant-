const Organization = require("../models/Organization");
const { validationResult } = require("express-validator");

// @route   POST /api/organizations
// @desc    Create a new organization
// @access  Private
exports.createOrganization = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    } = req.body;

    // Check if organization name already exists
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        error: "An organization with this name already exists",
      });
    }

    // Create new organization
    const organization = new Organization({
      name,
      description,
      owner: req.user.id, // From auth middleware
      contactEmail,
      contactPhone,
      address,
      socialMedia,
    });

    await organization.save();

    res.status(201).json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("Create organization error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @route   GET /api/organizations
// @desc    Get all organizations
// @access  Public
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ isActive: true })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @route   GET /api/organizations/:id
// @desc    Get organization by ID
// @access  Public
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    // removed for testing purposes, this will be added back later
    // .populate({
    //   path: 'pageants',
    //   match: { isPublic: true },
    //   select: 'name description startDate endDate coverImage'
    // });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    res.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("Get organization error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @route   GET /api/organizations/user
// @desc    Get organizations owned by the logged-in user
// @access  Private
exports.getUserOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ owner: req.user.id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    console.error("Get user organizations error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @route   PUT /api/organizations/:id
// @desc    Update organization
// @access  Private
exports.updateOrganization = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    contactEmail,
    contactPhone,
    address,
    socialMedia,
  } = req.body;

  // Build organization update object
  const organizationFields = {};
  if (name) organizationFields.name = name;
  if (description) organizationFields.description = description;
  if (contactEmail) organizationFields.contactEmail = contactEmail;
  if (contactPhone) organizationFields.contactPhone = contactPhone;
  if (address) organizationFields.address = address;
  if (socialMedia) organizationFields.socialMedia = socialMedia;

  try {
    // Check if organization exists
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    // Check if user is the organization owner
    if (organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this organization",
      });
    }

    // If name is being changed, check it's not already taken
    if (name && name !== organization.name) {
      const existingOrg = await Organization.findOne({ name });
      if (existingOrg) {
        return res.status(400).json({
          success: false,
          error: "An organization with this name already exists",
        });
      }
    }

    // Update
    organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: organizationFields },
      { new: true }
    );

    res.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("Update organization error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// @route   DELETE /api/organizations/:id
// @desc    Delete organization
// @access  Private
exports.deleteOrganization = async (req, res) => {
  try {
    // Check if organization exists
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    // Check if user is the organization owner
    if (organization.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this organization",
      });
    }

    // Instead of deleting, we can set isActive to false
    organization.isActive = false;
    await organization.save();

    // Or to actually delete: await organization.remove();

    res.json({
      success: true,
      message: "Organization removed",
    });
  } catch (error) {
    console.error("Delete organization error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
