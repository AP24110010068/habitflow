const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habittracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  createdAt: { type: Date, default: Date.now },
  theme: { type: String, default: 'pastel-pink' },
  profilePicture: String
});

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  participants: { type: Number, default: 1 }
});

const completionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  date: { type: String, required: true },
  photo: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatMessageSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Challenge = mongoose.model('Challenge', challengeSchema);
const Completion = mongoose.model('Completion', completionSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        token
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        challenges: user.challenges,
        theme: user.theme,
        token
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ==================== USER ROUTES ====================

// Get user data
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('challenges');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { name, theme, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, theme, profilePicture },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset user progress
app.post('/api/users/:id/reset', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        points: 0,
        challenges: []
      },
      { new: true }
    ).select('-password');

    // Delete user's completions
    await Completion.deleteMany({ userId: req.params.id });

    res.json(user);
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CHALLENGE ROUTES ====================

// Get all challenges
app.get('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create challenge
app.post('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      category,
      createdBy: req.user.id
    });

    await challenge.save();
    await challenge.populate('createdBy', 'name email');

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join challenge
app.post('/api/challenges/:id/join', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Add challenge to user's challenges
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { challenges: req.params.id } }
    );

    // Increment participant count
    challenge.participants = (challenge.participants || 0) + 1;
    await challenge.save();

    res.json({ message: 'Successfully joined challenge', challenge });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get challenge participants
app.get('/api/challenges/:id/participants', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ challenges: req.params.id })
      .select('name email points');
    
    res.json(users);
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== COMPLETION ROUTES ====================

// Get user completions
app.get('/api/completions/:userId', authenticateToken, async (req, res) => {
  try {
    const completions = await Completion.find({ userId: req.params.userId })
      .populate('challengeId', 'title description')
      .sort({ timestamp: -1 });
    
    res.json(completions);
  } catch (error) {
    console.error('Get completions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create completion
app.post('/api/completions', authenticateToken, async (req, res) => {
  try {
    const { userId, challengeId, photo, date } = req.body;

    // Check if already completed today
    const existingCompletion = await Completion.findOne({
      userId,
      challengeId,
      date
    });

    if (existingCompletion) {
      return res.status(400).json({ error: 'Challenge already completed for this date' });
    }

    // Create completion
    const completion = new Completion({
      userId,
      challengeId,
      photo,
      date
    });

    await completion.save();

    // Award points to user
    await User.findByIdAndUpdate(
      userId,
      { $inc: { points: 10 } }
    );

    res.status(201).json(completion);
  } catch (error) {
    console.error('Create completion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get completions by challenge
app.get('/api/completions/challenge/:challengeId', authenticateToken, async (req, res) => {
  try {
    const completions = await Completion.find({ challengeId: req.params.challengeId })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
    
    res.json(completions);
  } catch (error) {
    console.error('Get challenge completions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CHAT ROUTES ====================

// Get chat messages for a challenge
app.get('/api/chat/:challengeId', authenticateToken, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ challengeId: req.params.challengeId })
      .sort({ timestamp: 1 })
      .limit(100);
    
    res.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send chat message
app.post('/api/chat/:challengeId', authenticateToken, async (req, res) => {
  try {
    const { userId, userName, message } = req.body;
    
    const chatMessage = new ChatMessage({
      challengeId: req.params.challengeId,
      userId,
      userName,
      message
    });

    await chatMessage.save();

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== STATISTICS ROUTES ====================

// Get user statistics
app.get('/api/statistics/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const completions = await Completion.find({ userId: req.params.userId });
    
    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(completions.map(c => c.date))].sort();
    
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || new Date(dates[i]) - new Date(dates[i-1]) === 86400000) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        if (dates[i] === today || dates[i] === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
    }
    
    res.json({
      totalPoints: user.points,
      totalCompletions: completions.length,
      totalChallenges: user.challenges.length,
      currentStreak,
      longestStreak,
      completionRate: user.challenges.length > 0 
        ? Math.round((completions.length / user.challenges.length) * 100) 
        : 0
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== INITIALIZATION ROUTE ====================

// Initialize sample challenges (run once)
app.post('/api/init-challenges', async (req, res) => {
  try {
    const existingChallenges = await Challenge.countDocuments();
    
    if (existingChallenges === 0) {
      // Create a system user for sample challenges
      let systemUser = await User.findOne({ email: 'system@habitflow.com' });
      
      if (!systemUser) {
        systemUser = new User({
          email: 'system@habitflow.com',
          password: await bcrypt.hash('system123', 10),
          name: 'HabitFlow System'
        });
        await systemUser.save();
      }
      
      const sampleChallenges = [
        {
          title: '30-Day Meditation',
          description: 'Meditate for 10 minutes every day to improve focus and reduce stress',
          category: 'Wellness',
          createdBy: systemUser._id,
          participants: 42
        },
        {
          title: 'Read 30 Pages Daily',
          description: 'Build a reading habit by reading 30 pages every day',
          category: 'Learning',
          createdBy: systemUser._id,
          participants: 78
        },
        {
          title: 'Drink 8 Glasses of Water',
          description: 'Stay hydrated throughout the day for better health',
          category: 'Health',
          createdBy: systemUser._id,
          participants: 156
        },
        {
          title: 'Morning Workout',
          description: 'Exercise for 30 minutes every morning to boost energy',
          category: 'Fitness',
          createdBy: systemUser._id,
          participants: 93
        },
        {
          title: 'Gratitude Journal',
          description: 'Write 3 things you\'re grateful for each day',
          category: 'Mindfulness',
          createdBy: systemUser._id,
          participants: 67
        }
      ];
      
      await Challenge.insertMany(sampleChallenges);
      
      res.json({ message: 'Sample challenges created successfully' });
    } else {
      res.json({ message: 'Challenges already exist' });
    }
  } catch (error) {
    console.error('Init challenges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 HabitFlow Server Running        ║
  ║   📡 Port: ${PORT}                      ║
  ║   🗄️  Database: MongoDB               ║
  ╚═══════════════════════════════════════╝
  `);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;
