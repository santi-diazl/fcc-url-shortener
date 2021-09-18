const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const URLSchema = new Schema({
  original_url: {type: String, required: true},
  short_url: {type: Number, required: true},
});

module.exports = mongoose.model('urls', URLSchema);
