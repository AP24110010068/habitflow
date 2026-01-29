# 🚀 QUICK START GUIDE - HabitFlow

## ⚡ Fastest Way to Get Running

### 1️⃣ Install MongoDB (One-time)
**Choose your system:**

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download: https://www.mongodb.com/try/download/community
- Run installer → MongoDB runs automatically

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2️⃣ Setup Backend (Terminal 1)
```bash
cd backend
npm install
cp .env.example .env
npm run init-db
npm run dev
```

✅ Wait for: "MongoDB connected successfully"

### 3️⃣ Setup Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

✅ Browser opens at http://localhost:3000

### 4️⃣ Create Account & Use!
1. Enter email and password
2. Click "Get Started"
3. Browse and join challenges
4. Complete daily tasks with photos
5. Earn points and redeem rewards!

---

## 📋 System Requirements

- Node.js 14+ ✅
- MongoDB 4.4+ ✅
- 2GB RAM minimum
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 🆘 Quick Troubleshooting

### MongoDB not connecting?
```bash
# Check if running
mongosh  # If connects, MongoDB is running

# Not running? Start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port already in use?
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill
```

### Module not found?
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

---

## 🎯 What You Get

✨ **Frontend (React):**
- Login/Signup page
- Dashboard with statistics
- Challenges browser
- Calendar view
- Rewards system
- Chat rooms
- 4 pastel themes
- Settings page

🔧 **Backend (Express.js):**
- User authentication (JWT)
- Challenge CRUD operations
- Photo upload support
- Points & rewards logic
- Chat API
- Statistics calculation
- RESTful API

🗄️ **Database (MongoDB):**
- Users collection
- Challenges collection
- Completions collection
- Chat messages collection
- Sample data included

---

## 💻 Commands Reference

### Backend Commands
```bash
npm install      # Install dependencies
npm run dev      # Start with auto-reload
npm start        # Start production
npm run init-db  # Initialize database
```

### Frontend Commands
```bash
npm install      # Install dependencies
npm start        # Start dev server
npm run build    # Build for production
```

### MongoDB Commands
```bash
mongosh                          # Connect to MongoDB
use habittracker                 # Switch to database
db.users.find()                  # View users
db.challenges.find()             # View challenges
db.completions.find()            # View completions
```

---

## 📦 What's Included

```
habitflow/
├── backend/
│   ├── server.js               ← Express server
│   ├── package.json            ← Dependencies
│   ├── .env.example            ← Config template
│   └── scripts/
│       └── initDatabase.js     ← DB setup
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             ← Main React app
│   │   ├── index.js            ← Entry point
│   │   └── index.css           ← Styles
│   ├── public/
│   │   └── index.html          ← HTML template
│   └── package.json            ← Dependencies
│
└── README.md                   ← Full documentation
```

---

## 🎨 Features Overview

### For Users:
- Create account instantly
- Join unlimited challenges
- Upload photos for verification
- Earn 10 points per completion
- Redeem 100 points = ₹10
- Chat with other members
- Track progress on calendar
- View consistency statistics
- Choose from 4 themes

### For Developers:
- Clean separation (frontend/backend)
- RESTful API design
- JWT authentication
- MongoDB with Mongoose
- React with hooks
- Recharts for visualization
- Lucide icons
- Responsive design
- Easy to extend

---

## 🚀 Next Steps After Setup

1. **Create your account** at http://localhost:3000
2. **Join sample challenges** (10 pre-loaded)
3. **Complete a challenge** with photo
4. **Earn your first 10 points**
5. **Check the calendar** to see completion
6. **View statistics** to track consistency
7. **Join chat room** to interact
8. **Create your own challenge** and share!

---

## 📞 Need Help?

1. Check the full README.md for detailed docs
2. Review troubleshooting section
3. Check MongoDB logs
4. Inspect browser console
5. Verify both servers are running

---

## 🎉 You're All Set!

The app is now ready to use. Start building habits, earning rewards, and connecting with others!

**Happy Habit Building! 🎯✨**
