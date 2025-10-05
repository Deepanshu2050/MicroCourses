const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const CreatorApplication = require('../models/CreatorApplication');
const User = require('../models/User');
const Course = require('../models/Course');

const router = express.Router();

// Review creator applications
router.get('/creator-applications', requireAuth, requireRole('admin'), async (_req, res) => {
  const apps = await CreatorApplication.find({ status: 'pending' }).populate('user');
  res.json(apps);
});

router.post('/creator-applications/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const app = await CreatorApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Not found' });
  app.status = 'approved';
  await app.save();
  await User.findByIdAndUpdate(app.user, { role: 'creator' });
  res.json(app);
});

router.post('/creator-applications/:id/reject', requireAuth, requireRole('admin'), async (req, res) => {
  const app = await CreatorApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Not found' });
  app.status = 'rejected';
  await app.save();
  res.json(app);
});

// Publish course
router.post('/courses/:id/publish', requireAuth, requireRole('admin'), async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, { published: true }, { new: true });
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json(course);
});

module.exports = router;


