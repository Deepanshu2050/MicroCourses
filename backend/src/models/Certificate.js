const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    serialHash: { type: String, required: true, unique: true, index: true }
  },
  { timestamps: true }
);

CertificateSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', CertificateSchema);


