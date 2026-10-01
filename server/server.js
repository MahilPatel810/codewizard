require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const roomRoutes = require('./routes/roomRoutes');
const eventRoutes = require('./routes/eventRoutes');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorHandler');
const { seedData } = require('./seed/seedDatabase');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CHARUSAT Scheduler API running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/charusat_scheduler';

async function startServer() {
  let isConnected = false;

  // 1. Attempt connection to configured MONGO_URI (e.g., local MongoDB or Atlas)
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB successfully.');
    isConnected = true;
  } catch (err) {
    console.warn(`⚠️  Could not connect to external MongoDB: ${err.message}`);
  }

  // 2. If standalone MongoDB is not available, launch embedded in-memory database
  if (!isConnected) {
    try {
      console.log('⚡ Launching embedded In-Memory MongoDB engine...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      console.log(`✅ Embedded MongoDB ready at: ${inMemoryUri}`);

      await mongoose.connect(inMemoryUri);
      console.log('🌱 Auto-seeding authentic CHARUSAT / CSPIT database records...');
      await seedData(false);
      isConnected = true;
    } catch (memErr) {
      console.error('❌ Failed to start embedded database:', memErr.message);
      process.exit(1);
    }
  }

  // 3. Start Express HTTP listener
  app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`🚀 CHARUSAT Smart Scheduler API is LIVE on port ${PORT}`);
    console.log(`📡 Base URL:    http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════════════════════\n');
  });
}

startServer();
