const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const crypto = require('crypto');

const router = express.Router();

// List only published courses
router.get('/courses', async (_req, res) => {
  const courses = await Course.find({ published: true }).sort({ createdAt: -1 });
  res.json(courses);
});

router.get('/courses/:id', async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, published: true });
  if (!course) return res.status(404).json({ error: 'Not found' });
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });
  res.json({ course, lessons });
});

// Enroll
router.post('/courses/:id/enroll', requireAuth, async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, published: true });
  if (!course) return res.status(404).json({ error: 'Not found' });
  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user.id, course: course._id },
    { $setOnInsert: { completedLessonIds: [], progressPercent: 0 } },
    { new: true, upsert: true }
  );
  res.json(enrollment);
});

// Complete lesson and update progress
router.post('/lessons/:lessonId/complete', requireAuth, async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Not found' });
  const enrollment = await Enrollment.findOne({ user: req.user.id, course: lesson.course });
  if (!enrollment) return res.status(400).json({ error: 'Not enrolled' });
  const lessons = await Lesson.find({ course: lesson.course });
  const total = lessons.length || 1;
  const set = new Set(enrollment.completedLessonIds.map(String));
  set.add(String(lesson._id));
  const completed = Array.from(set).map((id) => id);
  const progressPercent = Math.round((completed.length / total) * 100);
  enrollment.completedLessonIds = completed;
  enrollment.progressPercent = progressPercent;
  await enrollment.save();
  res.json(enrollment);
});

// Progress
router.get('/progress', requireAuth, async (req, res) => {
  const items = await Enrollment.find({ user: req.user.id }).populate('course');
  res.json(items);
});

// Issue certificate at 100%
router.post('/courses/:id/certificate', requireAuth, async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, published: true });
  if (!course) return res.status(404).json({ error: 'Not found' });
  const enrollment = await Enrollment.findOne({ user: req.user.id, course: course._id });
  if (!enrollment || enrollment.progressPercent !== 100) {
    return res.status(400).json({ error: 'Course not fully completed' });
  }
  const hash = crypto.createHash('sha256')
    .update(`${req.user.id}:${course._id}:${Date.now()}`)
    .digest('hex')
    .slice(0, 16);
  const cert = await Certificate.findOneAndUpdate(
    { user: req.user.id, course: course._id },
    { serialHash: hash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(cert);
});

module.exports = router;


