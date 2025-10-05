const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);


