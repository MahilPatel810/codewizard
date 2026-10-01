require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/authRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const roomRoutes = require('./routes/roomRoutes');
const eventRoutes = require('./routes/eventRoutes');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'CHARUSAT Scheduler API running',
      database: 'Connected to Neon PostgreSQL',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('🔗 Testing connection to Neon PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Successfully connected to Neon Serverless PostgreSQL.');

    app.listen(PORT, () => {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log(`🚀 CHARUSAT Scheduler API (PostgreSQL + Prisma) is LIVE on port ${PORT}`);
      console.log(`📡 Base URL:    http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Database:    Neon Serverless PostgreSQL (AWS ap-southeast-1)`);
      console.log('═══════════════════════════════════════════════════════════════\n');
    });
  } catch (err) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', err.message);
    process.exit(1);
  }
}

startServer();
