const mongoose = require('mongoose');

const IqConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, enum: ['items', 'norms'] },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  previous: { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('IqConfig', IqConfigSchema);
