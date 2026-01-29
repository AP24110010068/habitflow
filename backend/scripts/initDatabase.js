const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habittracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Define schemas (same as in server.js)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  createdAt: { type: Date, default: Date.now },
  theme: { type: String, default: 'pastel-pink' }
});

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  participants: { type: Number, default: 1 }
});

const User = mongoose.model('User', userSchema);
const Challenge = mongoose.model('Challenge', challengeSchema);

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Create system user
    let systemUser = await User.findOne({ email: 'system@habitflow.com' });
    
    if (!systemUser) {
      console.log('📝 Creating system user...');
      systemUser = new User({
        email: 'system@habitflow.com',
        password: await bcrypt.hash('system123', 10),
        name: 'HabitFlow System',
        points: 0
      });
      await systemUser.save();
      console.log('✅ System user created');
    } else {
      console.log('ℹ️  System user already exists');
    }

    // Create sample challenges
    const existingChallenges = await Challenge.countDocuments();
    
    if (existingChallenges === 0) {
      console.log('📝 Creating sample challenges...');
      
      const sampleChallenges = [
        {
          title: '30-Day Meditation',
          description: 'Meditate for 10 minutes every day to improve focus and reduce stress. Find a quiet space, sit comfortably, and focus on your breath.',
          category: 'Wellness',
          createdBy: systemUser._id,
          participants: 42
        },
        {
          title: 'Read 30 Pages Daily',
          description: 'Build a reading habit by reading 30 pages every day. Pick a book you enjoy and make it part of your daily routine.',
          category: 'Learning',
          createdBy: systemUser._id,
          participants: 78
        },
        {
          title: 'Drink 8 Glasses of Water',
          description: 'Stay hydrated throughout the day for better health. Track your water intake and aim for 8 glasses (2 liters) daily.',
          category: 'Health',
          createdBy: systemUser._id,
          participants: 156
        },
        {
          title: 'Morning Workout',
          description: 'Exercise for 30 minutes every morning to boost energy. Choose activities you enjoy like jogging, yoga, or home workouts.',
          category: 'Fitness',
          createdBy: systemUser._id,
          participants: 93
        },
        {
          title: 'Gratitude Journal',
          description: 'Write 3 things you\'re grateful for each day. This simple practice can significantly improve your mental wellbeing and outlook on life.',
          category: 'Mindfulness',
          createdBy: systemUser._id,
          participants: 67
        },
        {
          title: '10,000 Steps Challenge',
          description: 'Walk 10,000 steps every day. Use a pedometer or smartphone app to track your steps and stay active throughout the day.',
          category: 'Fitness',
          createdBy: systemUser._id,
          participants: 134
        },
        {
          title: 'No Sugar Week',
          description: 'Go sugar-free for 7 days. Eliminate refined sugars from your diet and discover healthier alternatives.',
          category: 'Health',
          createdBy: systemUser._id,
          participants: 89
        },
        {
          title: 'Learn a New Language',
          description: 'Practice a new language for 20 minutes daily. Use apps, flashcards, or conversation practice to build fluency.',
          category: 'Learning',
          createdBy: systemUser._id,
          participants: 56
        },
        {
          title: 'Digital Detox Evening',
          description: 'No screens 2 hours before bed. Give your mind a break from digital stimulation and improve your sleep quality.',
          category: 'Wellness',
          createdBy: systemUser._id,
          participants: 102
        },
        {
          title: 'Creative Writing Daily',
          description: 'Write 500 words every day. Fiction, journal entries, or poetry - let your creativity flow and improve your writing skills.',
          category: 'Creativity',
          createdBy: systemUser._id,
          participants: 45
        }
      ];
      
      await Challenge.insertMany(sampleChallenges);
      console.log(`✅ Created ${sampleChallenges.length} sample challenges`);
    } else {
      console.log(`ℹ️  Database already has ${existingChallenges} challenges`);
    }

    console.log('\n✨ Database initialization complete!');
    console.log('\n📊 Database Statistics:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Challenges: ${await Challenge.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
