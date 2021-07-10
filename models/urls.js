const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const URLSchema = new Schema({
  long_url: { type: String, required: true },
  short_url: { type: Number, unique: true },
});

module.exports = mongoose.model("urls", URLSchema);
