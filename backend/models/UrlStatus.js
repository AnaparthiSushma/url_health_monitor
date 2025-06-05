const mongoose = require('mongoose');

const UrlStatusSchema = new mongoose.Schema({
  url: String,
  status: String,
  responseTime: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UrlStatus', UrlStatusSchema);
