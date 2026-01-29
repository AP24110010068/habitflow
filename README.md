# HabitFlow - Full Stack Habit Tracking Application

A complete full-stack habit tracking application with React frontend, Express.js backend, and MongoDB database. Features include user authentication, challenge management, photo verification, rewards system, and real-time chat.

## 📁 Project Structure

```
habitflow/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json           # Backend dependencies
│   ├── .env.example          # Environment variables template
│   └── scripts/
│       └── initDatabase.js   # Database initialization script
│
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   └── package.json          # Frontend dependencies
│
└── README.md                 # This file
```

## 🚀 Quick Start

### Step 1: Install MongoDB
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **macOS**: `brew install mongodb-community && brew services start mongodb-community`
- **Linux**: Follow instructions at https://docs.mongodb.com/manual/installation/

### Step 2: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run init-db  # Initialize sample data
npm run dev      # Start server on port 5000
```

### Step 3: Setup Frontend
```bash
cd frontend
npm install
npm start        # Start React app on port 3000
```

### Step 4: Create Account & Start Using!
- Open http://localhost:3000
- Enter email and password to create account
- Browse challenges and start building habits!

## 🎯 Complete Setup Instructions

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB v4.4+ ([Download](https://www.mongodb.com/try/download/community))
- npm (comes with Node.js)

### Backend Setup

1. **Navigate to backend folder**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

This installs:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin requests)
- dotenv (Environment variables)

3. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=change-this-to-a-random-secret-key
NODE_ENV=development
```

4. **Initialize database**:
```bash
npm run init-db
```

This creates:
- System user
- 10 sample challenges
- Database collections

5. **Start the server**:
```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 HabitFlow Server Running
📡 Port: 5000
```

### Frontend Setup

1. **Open new terminal, navigate to frontend**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

This installs:
- react & react-dom
- recharts (Charts library)
- lucide-react (Icons)

3. **Start React app**:
```bash
npm start
```

Browser opens automatically at http://localhost:3000

## 📖 How to Use

### Creating Your First Account
1. Enter any email (e.g., `myemail@example.com`)
2. Enter a password
3. Click "Get Started"
4. Account is created and you're logged in!

### Joining Challenges
1. Click **"Challenges"** in sidebar
2. Browse available challenges
3. Click **"Join"** on challenges you like
4. They appear in your Dashboard

### Completing Challenges
1. Go to **Dashboard** or **My Habits**
2. Click **"Complete"** button
3. **Upload a photo** (required!)
4. Earn 10 points instantly

### Earning Rewards
- 10 points per completed challenge
- 100 points = ₹10 redeemable
- Track in **Rewards** page
- View total in sidebar

### Using Chat Rooms
1. Click chat icon 💬 on any challenge
2. Send messages to other participants
3. Build community and stay motivated

### Tracking Progress
- **Calendar**: See completion history with medal icons
- **Statistics**: View 7-day consistency graph
- **My Habits**: See all active challenges and photos

## 🔌 API Reference

### Authentication
```http
POST /api/auth/signup
POST /api/auth/login
```

### Users
```http
GET    /api/users/:id
PUT    /api/users/:id
POST   /api/users/:id/reset
```

### Challenges
```http
GET    /api/challenges
POST   /api/challenges
POST   /api/challenges/:id/join
GET    /api/challenges/:id/participants
```

### Completions
```http
GET    /api/completions/:userId
POST   /api/completions
GET    /api/completions/challenge/:challengeId
```

### Chat
```http
GET    /api/chat/:challengeId
POST   /api/chat/:challengeId
```

### Statistics
```http
GET    /api/statistics/:userId
```

## 🗄️ Database Schema

### Users
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  points: Number,
  challenges: [ObjectId],
  theme: String,
  createdAt: Date
}
```

### Challenges
```javascript
{
  title: String,
  description: String,
  category: String,
  createdBy: ObjectId,
  participants: Number,
  createdAt: Date
}
```

### Completions
```javascript
{
  userId: ObjectId,
  challengeId: ObjectId,
  date: String (YYYY-MM-DD),
  photo: String (base64),
  timestamp: Date
}
```

### Chat Messages
```javascript
{
  challengeId: ObjectId,
  userId: ObjectId,
  userName: String,
  message: String,
  timestamp: Date
}
```

## 🎨 Features

✅ User authentication (signup/login)
✅ Create & join public challenges
✅ Photo verification for completions
✅ Points & rewards system (100 pts = ₹10)
✅ Calendar with completion tracking
✅ Statistics & analytics
✅ Chat rooms for challenges
✅ 4 beautiful pastel themes
✅ Responsive design
✅ Real-time updates

## 🐛 Troubleshooting

### MongoDB Won't Connect
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Start MongoDB if needed
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill    # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Frontend (port 3000)
lsof -ti:3000 | xargs kill    # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Backend Errors
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Frontend Errors
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### Cannot Login
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify API_URL in App.jsx is `http://localhost:5000/api`

## 📝 File Structure

```
backend/
├── server.js           # Express server with all routes
├── package.json        # Dependencies
├── .env.example        # Environment template
└── scripts/
    └── initDatabase.js # DB initialization

frontend/
├── public/
│   └── index.html      # HTML template
├── src/
│   ├── App.jsx         # Main component with all pages
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies
```

## 🚀 Deployment

### MongoDB Atlas (Cloud Database)
1. Create free cluster at https://mongodb.com/cloud/atlas
2. Get connection string
3. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habittracker
```

### Backend (Railway/Heroku)
1. Push code to Git repository
2. Connect to Railway/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Update API_URL in App.jsx to backend URL
2. Run `npm run build`
3. Deploy build folder

## 💡 Tips

- **Development**: Use `npm run dev` for auto-reload
- **Database**: Use MongoDB Compass to view data visually
- **Testing API**: Use Postman or curl
- **Themes**: Try all 4 pastel themes in Settings
- **Photos**: Compress large images before upload

## 🔒 Security Features

- Bcrypt password hashing (10 rounds)
- JWT authentication (7-day tokens)
- CORS enabled
- Protected API routes
- Input validation

## 📈 Future Enhancements

- WebSocket for real-time chat
- Email notifications
- Social sharing
- Leaderboards
- Mobile app
- Payment gateway
- Push notifications

## 🤝 Support

Issues? Check:
1. MongoDB is running
2. Both servers are running
3. Correct ports (5000 backend, 3000 frontend)
4. Environment variables are set
5. Dependencies are installed

## 📄 License

MIT License - Free to use

---

**Happy Habit Building! 🎯✨**

Made with ❤️ using React, Express.js & MongoDB
