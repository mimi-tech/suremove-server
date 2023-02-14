const mongoose = require("mongoose");

const commons = new mongoose.Schema(
  {
    sizeRange: {
        type: Array,
        required: [true, "Size range must be provided"],
      },

      weightRange: {
        type: Array,
        required: [true, "weight range must be provided"],
      },

      contributorId: {
        type: String
      },

      ownerId: {
        type: String
      },

      companyName:{
        type: String
      },

      companyAddress:{
        type: String
      }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Commons = mongoose.model("commons", commons);

module.exports = Commons;
