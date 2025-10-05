const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    transcript: { type: String },
    order: { type: Number, required: true }
  },
  { timestamps: true }
);

LessonSchema.index({ course: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', LessonSchema);


