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

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Commons = mongoose.model("commons", commons);

module.exports = Commons;
