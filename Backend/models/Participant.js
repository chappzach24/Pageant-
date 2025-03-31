const mongoose = require("mongoose");
const { validate } = require("./Pageant");

const ParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pageant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pageant",
      required: true,
    },
    categories: [
      {
        category: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          default: 0,
          min: 0,
          max: 10,
          validate: {
            validator: function (v) {
              // Allow scores to be between 0 and 10 with up to 1 decimal place
              return v >= 0 && v <= 10 && Math.round(v * 10) / 10 === v;
            },
            message: (props) =>
              `${props.value} is not a valid score! Scores must be between 0 and 10 with up to 1 decimal place.`,
          },
        },
        notes: String,
      },
    ],
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "confirmed", "withdrawn", "disqualified"],
      default: "registered",
    },
    notes: String,
    profileImage: {
      type: String,
      default: "default-profile.jpg",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only register once for a pageant
ParticipantSchema.index({ user: 1, pageant: 1 }, { unique: true });

module.exports = mongoose.model("Participant", ParticipantSchema);
