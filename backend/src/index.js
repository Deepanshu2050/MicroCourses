const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connect } = require('./config/db');
const creatorRoutes = require('./routes/creator');
const learnerRoutes = require('./routes/learner');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/creator', creatorRoutes);
app.use('/api/learner', learnerRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  await connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/microcourses');
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Fatal startup error', error);
  process.exit(1);
});


