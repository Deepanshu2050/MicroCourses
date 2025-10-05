const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const CreatorApplication = require('../models/CreatorApplication');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const router = express.Router();

// Simple signup/login for demo
router.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email already used' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'learner' });
  return res.json({ id: user._id });
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'devsecret');
  return res.json({ token, role: user.role });
});

// Apply to be creator
router.post('/apply', requireAuth, async (req, res) => {
  const { bio } = req.body;
  const app = await CreatorApplication.create({ user: req.user.id, bio });
  res.json(app);
});

// Creator: CRUD courses
router.post('/courses', requireAuth, async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({ title, description, creator: req.user.id, published: false });
  res.json(course);
});

router.put('/courses/:id', requireAuth, async (req, res) => {
  const course = await Course.findOneAndUpdate({ _id: req.params.id, creator: req.user.id }, req.body, { new: true });
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json(course);
});

router.delete('/courses/:id', requireAuth, async (req, res) => {
  const course = await Course.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
  if (!course) return res.status(404).json({ error: 'Not found' });
  await Lesson.deleteMany({ course: course._id });
  res.json({ ok: true });
});

// Lessons with unique order per course; auto-transcript (simple placeholder)
router.post('/courses/:courseId/lessons', requireAuth, async (req, res) => {
  const { title, content, order } = req.body;
  const course = await Course.findOne({ _id: req.params.courseId, creator: req.user.id });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const transcript = `Transcript for: ${title}\n${content.slice(0, 200)}`;
  try {
    const lesson = await Lesson.create({ course: course._id, title, content, transcript, order });
    res.json(lesson);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: 'Lesson order must be unique per course' });
    throw e;
  }
});

router.put('/lessons/:id', requireAuth, async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('course');
  if (!lesson || String(lesson.course.creator) !== req.user.id) return res.status(404).json({ error: 'Not found' });
  Object.assign(lesson, req.body);
  if (req.body.title || req.body.content) {
    const tTitle = req.body.title || lesson.title;
    const tContent = req.body.content || lesson.content;
    lesson.transcript = `Transcript for: ${tTitle}\n${tContent.slice(0, 200)}`;
  }
  try {
    await lesson.save();
    res.json(lesson);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: 'Lesson order must be unique per course' });
    throw e;
  }
});

router.delete('/lessons/:id', requireAuth, async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('course');
  if (!lesson || String(lesson.course.creator) !== req.user.id) return res.status(404).json({ error: 'Not found' });
  await lesson.deleteOne();
  res.json({ ok: true });
});

module.exports = router;


