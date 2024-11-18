const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'active' },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
