require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoConnected = true;
    console.log('[v0] MongoDB connected successfully');
    console.log('[v0] Connected to:', process.env.MONGODB_URI);
  } catch (err) {
    console.warn('[v0] MongoDB connection error:', err.message);
    console.warn('[v0] Using demo mode with mock data. To use real database:');
    console.warn('[v0] 1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.warn('[v0] 2. Start MongoDB: mongod');
    console.warn('[v0] 3. Restart this server');
  }
};

connectMongoDB();

// In-memory fallback database
let memoryDB = {
  users: [],
  dashboardData: {},
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Dashboard Data Schema
const dashboardDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revenue: { type: Number, default: 124592 },
  users: { type: Number, default: 2840 },
  conversions: { type: Number, default: 64 },
  engagement: { type: Number, default: 92 },
  metrics: [{
    month: String,
    value: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

let User, DashboardData;

const initializeModels = () => {
  User = mongoose.model('User', userSchema);
  DashboardData = mongoose.model('DashboardData', dashboardDataSchema);
};

// Initialize models only if Mongoose is available
if (mongoConnected) {
  initializeModels();
}

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const bcrypt = require('bcryptjs');
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (mongoConnected && User) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      const dashboardData = new DashboardData({ userId: user._id });
      await dashboardData.save();

      res.status(201).json({ 
        message: 'User registered successfully',
        userId: user._id 
      });
    } else {
      // Memory fallback
      const existingUser = memoryDB.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'user_' + Date.now();
      memoryDB.users.push({ _id: userId, name, email, password: hashedPassword });
      memoryDB.dashboardData[userId] = {
        userId,
        revenue: 124592,
        users: 2840,
        conversions: 64,
        engagement: 92,
      };

      res.status(201).json({ 
        message: 'User registered successfully',
        userId
      });
    }
  } catch (error) {
    console.error('[v0] Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = null;
    
    if (mongoConnected && User) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        message: 'Login successful',
        token,
        userId: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      // Memory fallback
      user = memoryDB.users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        message: 'Login successful',
        token,
        userId: user._id,
        name: user.name,
        email: user.email
      });
    }
  } catch (error) {
    console.error('[v0] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get dashboard data
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    if (mongoConnected && DashboardData) {
      const dashboardData = await DashboardData.findOne({ userId: req.userId });
      if (!dashboardData) {
        return res.status(404).json({ error: 'Dashboard data not found' });
      }
      res.json(dashboardData);
    } else {
      // Memory fallback
      const dashboardData = memoryDB.dashboardData[req.userId];
      if (!dashboardData) {
        return res.status(404).json({ error: 'Dashboard data not found' });
      }
      res.json(dashboardData);
    }
  } catch (error) {
    console.error('[v0] Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update dashboard data
app.put('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const { revenue, users, conversions, engagement } = req.body;
    
    if (mongoConnected && DashboardData) {
      const dashboardData = await DashboardData.findOneAndUpdate(
        { userId: req.userId },
        { revenue, users, conversions, engagement },
        { new: true }
      );
      res.json(dashboardData);
    } else {
      // Memory fallback
      if (!memoryDB.dashboardData[req.userId]) {
        memoryDB.dashboardData[req.userId] = { userId: req.userId };
      }
      memoryDB.dashboardData[req.userId] = {
        ...memoryDB.dashboardData[req.userId],
        revenue,
        users,
        conversions,
        engagement,
      };
      res.json(memoryDB.dashboardData[req.userId]);
    }
  } catch (error) {
    console.error('[v0] Update dashboard error:', error);
    res.status(500).json({ error: 'Failed to update dashboard data' });
  }
});

// Get user profile
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    if (mongoConnected && User) {
      const user = await User.findById(req.userId).select('-password');
      res.json(user);
    } else {
      // Memory fallback
      const user = memoryDB.users.find(u => u._id === req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    console.error('[v0] Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize demo user
const initDemoUser = async () => {
  try {
    const bcrypt = require('bcryptjs');
    
    if (mongoConnected && User) {
      // MongoDB mode
      const demoExists = await User.findOne({ email: 'demo@prism.com' });
      if (!demoExists) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const demoUser = new User({
          name: 'Demo User',
          email: 'demo@prism.com',
          password: hashedPassword,
        });
        await demoUser.save();

        const demoData = new DashboardData({
          userId: demoUser._id,
          revenue: 124592,
          users: 2840,
          conversions: 64,
          engagement: 92,
          metrics: [
            { month: 'Jan', value: 70000 },
            { month: 'Feb', value: 85000 },
            { month: 'Mar', value: 92000 },
            { month: 'Apr', value: 88000 },
            { month: 'May', value: 105000 },
            { month: 'Jun', value: 124592 },
          ],
        });
        await demoData.save();
        console.log('[v0] Demo account created: demo@prism.com / password123');
      }
    } else {
      // Memory mode
      const demoExists = memoryDB.users.find(u => u.email === 'demo@prism.com');
      if (!demoExists) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userId = 'demo_user_1';
        memoryDB.users.push({
          _id: userId,
          name: 'Demo User',
          email: 'demo@prism.com',
          password: hashedPassword,
        });
        memoryDB.dashboardData[userId] = {
          userId,
          revenue: 124592,
          users: 2840,
          conversions: 64,
          engagement: 92,
          metrics: [
            { month: 'Jan', value: 70000 },
            { month: 'Feb', value: 85000 },
            { month: 'Mar', value: 92000 },
            { month: 'Apr', value: 88000 },
            { month: 'May', value: 105000 },
            { month: 'Jun', value: 124592 },
          ],
        };
        console.log('[v0] Demo account created in memory: demo@prism.com / password123');
      }
    }
  } catch (error) {
    console.log('[v0] Demo user initialization error:', error.message);
  }
};

// Start server
const server = app.listen(PORT, async () => {
  console.log(`[v0] ================================================`);
  console.log(`[v0] Server running on http://localhost:${PORT}`);
  console.log(`[v0] ================================================`);
  console.log(`[v0]`);
  console.log(`[v0] Demo Credentials:`);
  console.log(`[v0] Email: demo@prism.com`);
  console.log(`[v0] Password: password123`);
  console.log(`[v0]`);
  
  if (mongoConnected) {
    console.log(`[v0] Database: MongoDB`);
  } else {
    console.log(`[v0] Database: In-Memory (data will be reset on restart)`);
    console.log(`[v0]`);
    console.log(`[v0] To use persistent MongoDB:`);
    console.log(`[v0] 1. Install MongoDB: https://docs.mongodb.com/manual/installation/`);
    console.log(`[v0] 2. Start MongoDB: mongod`);
    console.log(`[v0] 3. Restart this server`);
  }
  
  console.log(`[v0]`);
  console.log(`[v0] Open http://localhost:${PORT} in your browser`);
  console.log(`[v0] ================================================`);
  
  // Initialize demo user (works with both MongoDB and memory)
  await initDemoUser();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[v0] Shutting down server...');
  server.close(() => {
    console.log('[v0] Server closed');
    process.exit(0);
  });
});
