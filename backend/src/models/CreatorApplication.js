const mongoose = require('mongoose');

const CreatorApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bio: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreatorApplication', CreatorApplicationSchema);


