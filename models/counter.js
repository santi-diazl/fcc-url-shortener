const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  _id: { type: String },
  seq_value: { type: Number, required: true },
});

module.exports = mongoose.model("counter", CounterSchema);
