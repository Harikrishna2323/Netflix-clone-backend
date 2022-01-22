const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
    imgTitle: {
      type: String,
    },
    imgSm: {
      type: String,
    },
    seasons: {
      type: Number,
      required: true,
    },
    episodes: {
      type: Array,
      required: true,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    year: {
      type: Number,
    },
    limit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    isSeries: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", seriesSchema);
