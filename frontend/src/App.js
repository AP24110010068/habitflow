import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Camera, Trophy, Calendar as CalendarIcon, Home, Target, BarChart3, Award, Settings, Plus, Search, MessageCircle, Users, X, Upload, Check } from 'lucide-react';

// Database simulation using localStorage
const DB = {
  users: 'habit_tracker_users',
  challenges: 'habit_tracker_challenges',
  completions: 'habit_tracker_completions',
  chatMessages: 'habit_tracker_chat_messages',
  
  getUsers() {
    return JSON.parse(localStorage.getItem(this.users) || '[]');
  },
  
  saveUsers(users) {
    localStorage.setItem(this.users, JSON.stringify(users));
  },
  
  getChallenges() {
    return JSON.parse(localStorage.getItem(this.challenges) || '[]');
  },
  
  saveChallenges(challenges) {
    localStorage.setItem(this.challenges, JSON.stringify(challenges));
  },
  
  getCompletions() {
    return JSON.parse(localStorage.getItem(this.completions) || '[]');
  },
  
  saveCompletions(completions) {
    localStorage.setItem(this.completions, JSON.stringify(completions));
  },
  
  getChatMessages() {
    return JSON.parse(localStorage.getItem(this.chatMessages) || '{}');
  },
  
  saveChatMessages(messages) {
    localStorage.setItem(this.chatMessages, JSON.stringify(messages));
  }
};

// Initial sample challenges
const initializeSampleChallenges = () => {
  const existing = DB.getChallenges();
  if (existing.length === 0) {
    const sampleChallenges = [
      {
        id: 'c1',
        title: '30-Day Meditation',
        description: 'Meditate for 10 minutes every day',
        createdBy: 'System',
        createdAt: new Date().toISOString(),
        participants: 42,
        category: 'Wellness'
      },
      {
        id: 'c2',
        title: 'Read 30 Pages Daily',
        description: 'Build a reading habit by reading 30 pages every day',
        createdBy: 'System',
        createdAt: new Date().toISOString(),
        participants: 78,
        category: 'Learning'
      },
      {
        id: 'c3',
        title: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        createdBy: 'System',
        createdAt: new Date().toISOString(),
        participants: 156,
        category: 'Health'
      }
    ];
    DB.saveChallenges(sampleChallenges);
  }
};

const HabitTrackerApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [theme, setTheme] = useState('pastel-pink');
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', category: '' });
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    initializeSampleChallenges();
    setUsers(DB.getUsers());
    setChallenges(DB.getChallenges());
    setCompletions(DB.getCompletions());
    setChatMessages(DB.getChatMessages());
  }, []);

  const themes = {
    'pastel-pink': {
      primary: '#FFB5C2',
      secondary: '#FED9E5',
      accent: '#FF85A1',
      background: '#FFF5F7',
      text: '#2D1B1F',
      card: '#FFFFFF'
    },
    'pastel-blue': {
      primary: '#A8D8EA',
      secondary: '#C5E3F0',
      accent: '#7CBFDB',
      background: '#F0F8FF',
      text: '#1A2F3E',
      card: '#FFFFFF'
    },
    'pastel-purple': {
      primary: '#D4BBDD',
      secondary: '#E8DAF0',
      accent: '#B69DC7',
      background: '#FAF5FF',
      text: '#2E1F3B',
      card: '#FFFFFF'
    },
    'pastel-green': {
      primary: '#B8E6D5',
      secondary: '#D4F1E8',
      accent: '#8FD9C3',
      background: '#F0FFF8',
      text: '#1F3E2E',
      card: '#FFFFFF'
    }
  };

  const currentTheme = themes[theme];

  const handleLogin = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('home');
      setUserChallenges(user.challenges || []);
    } else if (loginEmail && loginPassword) {
      const newUser = {
        id: 'u' + Date.now(),
        email: loginEmail,
        password: loginPassword,
        name: loginEmail.split('@')[0],
        points: 0,
        challenges: [],
        completions: [],
        createdAt: new Date().toISOString(),
        profilePicture: null
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      DB.saveUsers(updatedUsers);
      setCurrentUser(newUser);
      setCurrentPage('home');
    }
  };

  const handleCreateChallenge = () => {
    if (newChallenge.title && newChallenge.description) {
      const challenge = {
        id: 'ch' + Date.now(),
        ...newChallenge,
        createdBy: currentUser.email,
        createdAt: new Date().toISOString(),
        participants: 1
      };
      const updatedChallenges = [...challenges, challenge];
      setChallenges(updatedChallenges);
      DB.saveChallenges(updatedChallenges);
      
      // Add to user's challenges
      const updatedUserChallenges = [...userChallenges, challenge.id];
      setUserChallenges(updatedUserChallenges);
      updateUserChallenges(updatedUserChallenges);
      
      setShowCreateChallenge(false);
      setNewChallenge({ title: '', description: '', category: '' });
    }
  };

  const joinChallenge = (challengeId) => {
    if (!userChallenges.includes(challengeId)) {
      const updatedUserChallenges = [...userChallenges, challengeId];
      setUserChallenges(updatedUserChallenges);
      updateUserChallenges(updatedUserChallenges);
      
      // Increment participant count
      const updatedChallenges = challenges.map(c => 
        c.id === challengeId ? { ...c, participants: (c.participants || 0) + 1 } : c
      );
      setChallenges(updatedChallenges);
      DB.saveChallenges(updatedChallenges);
    }
  };

  const updateUserChallenges = (newChallenges) => {
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? { ...u, challenges: newChallenges } : u
    );
    setUsers(updatedUsers);
    DB.saveUsers(updatedUsers);
    setCurrentUser({ ...currentUser, challenges: newChallenges });
  };

  const completeChallenge = (challengeId, photo) => {
    if (!photo) {
      alert('Please upload a photo to complete the challenge!');
      return;
    }

    const completion = {
      id: 'comp' + Date.now(),
      userId: currentUser.id,
      challengeId,
      date: new Date().toISOString().split('T')[0],
      photo,
      timestamp: new Date().toISOString()
    };
    
    const updatedCompletions = [...completions, completion];
    setCompletions(updatedCompletions);
    DB.saveCompletions(updatedCompletions);
    
    // Award points
    const updatedUser = { ...currentUser, points: (currentUser.points || 0) + 10 };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    DB.saveUsers(updatedUsers);
    
    setCompletionPhoto(null);
    setSelectedChallenge(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletionPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendChatMessage = (challengeId, message) => {
    const newMessage = {
      id: 'msg' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      message,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = {
      ...chatMessages,
      [challengeId]: [...(chatMessages[challengeId] || []), newMessage]
    };
    setChatMessages(updatedMessages);
    DB.saveChatMessages(updatedMessages);
  };

  const getChallengeCompletionStats = () => {
    const userCompletions = completions.filter(c => c.userId === currentUser?.id);
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = userCompletions.filter(c => c.date === today);
    
    return {
      completed: todayCompletions.length,
      pending: userChallenges.length - todayCompletions.length,
      total: userChallenges.length
    };
  };

  const getConsistencyData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = completions.filter(c => 
        c.userId === currentUser?.id && c.date === dateStr
      ).length;
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completions: count
      });
    }
    return last7Days;
  };

  const isDateCompleted = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completions.some(c => 
      c.userId === currentUser?.id && c.date === dateStr
    );
  };

  const filteredChallenges = challenges.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateProfile = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    DB.saveUsers(updatedUsers);
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      const resetUser = {
        ...currentUser,
        points: 0,
        challenges: [],
        completions: []
      };
      setCurrentUser(resetUser);
      const updatedUsers = users.map(u => u.id === currentUser.id ? resetUser : u);
      setUsers(updatedUsers);
      DB.saveUsers(updatedUsers);
      setUserChallenges([]);
      setCompletions(completions.filter(c => c.userId !== currentUser.id));
    }
  };

  // Login Page
  if (currentPage === 'login') {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${currentTheme.secondary} 0%, ${currentTheme.background} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Outfit", sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: currentTheme.card,
          borderRadius: '32px',
          padding: '48px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: `2px solid ${currentTheme.secondary}`
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              transform: 'rotate(5deg)'
            }}>
              <Trophy size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: currentTheme.text,
              margin: '0 0 8px'
            }}>HabitFlow</h1>
            <p style={{
              fontSize: '16px',
              color: currentTheme.text + '99',
              margin: 0
            }}>Build habits, earn rewards</p>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: currentTheme.text,
              marginBottom: '8px'
            }}>Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '16px',
                border: `2px solid ${currentTheme.secondary}`,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
              onBlur={(e) => e.target.style.borderColor = currentTheme.secondary}
            />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: currentTheme.text,
              marginBottom: '8px'
            }}>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '16px',
                border: `2px solid ${currentTheme.secondary}`,
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
              onBlur={(e) => e.target.style.borderColor = currentTheme.secondary}
            />
          </div>
          
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '16px',
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started
          </button>
          
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: currentTheme.text + '99',
            marginTop: '24px'
          }}>
            New here? Just enter your details to create an account
          </p>
        </div>
      </div>
    );
  }

  // Main Dashboard
  const menuItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'challenges', icon: Target, label: 'Challenges' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'rewards', icon: Award, label: 'Rewards' },
    { id: 'statistics', icon: BarChart3, label: 'Statistics' },
    { id: 'habits', icon: Check, label: 'My Habits' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const stats = getChallengeCompletionStats();
  const pieData = [
    { name: 'Completed', value: stats.completed, color: currentTheme.accent },
    { name: 'Pending', value: stats.pending, color: currentTheme.secondary }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: currentTheme.background,
      fontFamily: '"Outfit", sans-serif',
      display: 'flex'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: currentTheme.card,
        borderRight: `2px solid ${currentTheme.secondary}`,
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            transform: 'rotate(5deg)'
          }}>
            <Trophy size={32} color="white" />
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: currentTheme.text,
            margin: 0
          }}>HabitFlow</h2>
        </div>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                marginBottom: '8px',
                borderRadius: '16px',
                background: currentPage === item.id ? `${currentTheme.primary}33` : 'transparent',
                color: currentPage === item.id ? currentTheme.accent : currentTheme.text + 'CC',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: currentPage === item.id ? '600' : '500'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = `${currentTheme.secondary}66`;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <item.icon size={20} style={{ marginRight: '12px' }} />
              {item.label}
            </div>
          ))}
        </nav>
        
        <div style={{
          padding: '16px',
          background: `${currentTheme.primary}22`,
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: currentTheme.accent,
            marginBottom: '4px'
          }}>
            {currentUser?.points || 0}
          </div>
          <div style={{
            fontSize: '13px',
            color: currentTheme.text + 'AA',
            fontWeight: '500'
          }}>Total Points</div>
          <div style={{
            fontSize: '12px',
            color: currentTheme.text + '88',
            marginTop: '8px'
          }}>
            ₹{Math.floor((currentUser?.points || 0) / 10)} redeemable
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '40px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: currentTheme.text,
              margin: '0 0 8px'
            }}>
              {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
            </h1>
            <p style={{
              fontSize: '16px',
              color: currentTheme.text + '99',
              margin: 0
            }}>Welcome back, {currentUser?.name}!</p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              padding: '12px 20px',
              background: currentTheme.card,
              borderRadius: '16px',
              border: `2px solid ${currentTheme.secondary}`,
              fontWeight: '600',
              color: currentTheme.accent
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        
        {/* Dashboard/Home */}
        {currentPage === 'home' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: currentTheme.card,
                borderRadius: '24px',
                padding: '28px',
                border: `2px solid ${currentTheme.secondary}`
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: currentTheme.text,
                  marginBottom: '24px'
                }}>Today's Progress</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: currentTheme.accent }}>
                      {stats.completed}
                    </div>
                    <div style={{ fontSize: '13px', color: currentTheme.text + '99' }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: currentTheme.primary }}>
                      {stats.pending}
                    </div>
                    <div style={{ fontSize: '13px', color: currentTheme.text + '99' }}>Pending</div>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                borderRadius: '24px',
                padding: '28px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <Trophy size={48} style={{ marginBottom: '16px', opacity: 0.9 }} />
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    opacity: 0.95
                  }}>Current Points</h3>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    {currentUser?.points || 0}
                  </div>
                </div>
                <div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {100 - ((currentUser?.points || 0) % 100)} points to next ₹10
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '28px',
              border: `2px solid ${currentTheme.secondary}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: currentTheme.text,
                  margin: 0
                }}>My Active Challenges</h3>
                <button
                  onClick={() => setCurrentPage('challenges')}
                  style={{
                    padding: '10px 20px',
                    background: currentTheme.primary,
                    color: currentTheme.text,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  View All
                </button>
              </div>
              
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {challenges.filter(c => userChallenges.includes(c.id)).slice(0, 3).map(challenge => {
                  const todayCompleted = completions.some(comp => 
                    comp.userId === currentUser.id && 
                    comp.challengeId === challenge.id && 
                    comp.date === new Date().toISOString().split('T')[0]
                  );
                  
                  return (
                    <div key={challenge.id} style={{
                      background: currentTheme.background,
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: currentTheme.text,
                          margin: '0 0 6px'
                        }}>{challenge.title}</h4>
                        <p style={{
                          fontSize: '14px',
                          color: currentTheme.text + '99',
                          margin: '0 0 8px'
                        }}>{challenge.description}</p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: currentTheme.text + '88'
                        }}>
                          <Users size={14} />
                          {challenge.participants} members
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {todayCompleted ? (
                          <div style={{
                            padding: '10px 20px',
                            background: `${currentTheme.accent}22`,
                            color: currentTheme.accent,
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Check size={16} />
                            Completed
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedChallenge(challenge.id);
                              setCompletionPhoto(null);
                            }}
                            style={{
                              padding: '10px 20px',
                              background: currentTheme.accent,
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            Complete
                          </button>
                        )}
                        
                        <button
                          onClick={() => setShowChatRoom(challenge.id)}
                          style={{
                            padding: '10px',
                            background: currentTheme.primary,
                            color: currentTheme.text,
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <MessageCircle size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Challenges Page */}
        {currentPage === 'challenges' && (
          <div>
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <Search size={20} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentTheme.text + '88'
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges..."
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    borderRadius: '16px',
                    border: `2px solid ${currentTheme.secondary}`,
                    fontSize: '16px',
                    outline: 'none',
                    background: currentTheme.card,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <button
                onClick={() => setShowCreateChallenge(true)}
                style={{
                  padding: '14px 24px',
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'inherit'
                }}
              >
                <Plus size={20} />
                Create Challenge
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredChallenges.map(challenge => (
                <div key={challenge.id} style={{
                  background: currentTheme.card,
                  borderRadius: '20px',
                  padding: '24px',
                  border: `2px solid ${currentTheme.secondary}`,
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {challenge.category && (
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: `${currentTheme.primary}33`,
                      color: currentTheme.accent,
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      {challenge.category}
                    </div>
                  )}
                  
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: currentTheme.text,
                    margin: '0 0 8px'
                  }}>{challenge.title}</h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: currentTheme.text + '99',
                    margin: '0 0 16px',
                    lineHeight: '1.5'
                  }}>{challenge.description}</p>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: `1px solid ${currentTheme.secondary}`
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px',
                      color: currentTheme.text + '88'
                    }}>
                      <Users size={16} />
                      {challenge.participants} members
                    </div>
                    
                    {userChallenges.includes(challenge.id) ? (
                      <div style={{
                        padding: '8px 16px',
                        background: `${currentTheme.accent}22`,
                        color: currentTheme.accent,
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        Joined
                      </div>
                    ) : (
                      <button
                        onClick={() => joinChallenge(challenge.id)}
                        style={{
                          padding: '8px 16px',
                          background: currentTheme.accent,
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Calendar Page */}
        {currentPage === 'calendar' && (
          <div style={{
            background: currentTheme.card,
            borderRadius: '24px',
            padding: '32px',
            border: `2px solid ${currentTheme.secondary}`,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentTheme.text,
              marginBottom: '24px',
              textAlign: 'center'
            }}>Challenge Completion Calendar</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '12px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentTheme.text + 'AA',
                  padding: '12px'
                }}>
                  {day}
                </div>
              ))}
              
              {(() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const startPadding = firstDay.getDay();
                const days = [];
                
                for (let i = 0; i < startPadding; i++) {
                  days.push(<div key={`padding-${i}`} />);
                }
                
                for (let day = 1; day <= lastDay.getDate(); day++) {
                  const date = new Date(today.getFullYear(), today.getMonth(), day);
                  const isCompleted = isDateCompleted(date);
                  const isToday = day === today.getDate();
                  
                  days.push(
                    <div
                      key={day}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: isToday ? currentTheme.primary : (isCompleted ? `${currentTheme.accent}22` : currentTheme.background),
                        border: isToday ? `2px solid ${currentTheme.accent}` : 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: isToday ? 'white' : currentTheme.text
                      }}>
                        {day}
                      </div>
                      {isCompleted && (
                        <Trophy size={16} style={{
                          color: currentTheme.accent,
                          marginTop: '4px'
                        }} />
                      )}
                    </div>
                  );
                }
                
                return days;
              })()}
            </div>
            
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: currentTheme.background,
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              gap: '32px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: currentTheme.text + 'AA'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: `${currentTheme.accent}22`
                }} />
                Completed
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: currentTheme.text + 'AA'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: currentTheme.primary
                }} />
                Today
              </div>
            </div>
          </div>
        )}
        
        {/* Rewards Page */}
        {currentPage === 'rewards' && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '32px'
            }}>
              <Trophy size={64} style={{ marginBottom: '16px', opacity: 0.9 }} />
              <h2 style={{
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 8px'
              }}>
                {currentUser?.points || 0}
              </h2>
              <p style={{
                fontSize: '18px',
                opacity: 0.9,
                margin: '0 0 24px'
              }}>Total Points Earned</p>
              
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '16px 32px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  ₹{Math.floor((currentUser?.points || 0) / 10)}
                </div>
                <div style={{
                  fontSize: '14px',
                  opacity: 0.9
                }}>
                  Available to Redeem
                </div>
              </div>
            </div>
            
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${currentTheme.secondary}`
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '16px'
              }}>How Rewards Work</h3>
              
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                <div style={{
                  background: currentTheme.background,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: currentTheme.primary,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Camera size={24} color={currentTheme.accent} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: currentTheme.text,
                      margin: '0 0 6px'
                    }}>Complete with Photo</h4>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.text + '99',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Upload a photo when completing each challenge to earn 10 points
                    </p>
                  </div>
                </div>
                
                <div style={{
                  background: currentTheme.background,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: currentTheme.primary,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Trophy size={24} color={currentTheme.accent} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: currentTheme.text,
                      margin: '0 0 6px'
                    }}>Collect 100 Points</h4>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.text + '99',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Every 100 points converts to ₹10 that you can redeem
                    </p>
                  </div>
                </div>
                
                <div style={{
                  background: currentTheme.background,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: currentTheme.primary,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={24} color={currentTheme.accent} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: currentTheme.text,
                      margin: '0 0 6px'
                    }}>Redeem Rewards</h4>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.text + '99',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Transfer your earned money directly to your account
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                style={{
                  width: '100%',
                  marginTop: '24px',
                  padding: '16px',
                  background: currentTheme.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (currentUser?.points || 0) >= 100 ? 'pointer' : 'not-allowed',
                  opacity: (currentUser?.points || 0) >= 100 ? 1 : 0.5,
                  fontFamily: 'inherit'
                }}
                onClick={() => {
                  if ((currentUser?.points || 0) >= 100) {
                    alert(`Redeeming ₹${Math.floor((currentUser?.points || 0) / 10)}! This feature would integrate with payment gateway.`);
                  }
                }}
              >
                {(currentUser?.points || 0) >= 100 
                  ? `Redeem ₹${Math.floor((currentUser?.points || 0) / 10)}` 
                  : `Need ${100 - ((currentUser?.points || 0) % 100)} more points`}
              </button>
            </div>
          </div>
        )}
        
        {/* Statistics Page */}
        {currentPage === 'statistics' && (
          <div>
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${currentTheme.secondary}`,
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '24px'
              }}>Daily Consistency (Last 7 Days)</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getConsistencyData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.secondary} />
                  <XAxis dataKey="date" stroke={currentTheme.text + '99'} />
                  <YAxis stroke={currentTheme.text + '99'} />
                  <Tooltip 
                    contentStyle={{
                      background: currentTheme.card,
                      border: `2px solid ${currentTheme.secondary}`,
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="completions" fill={currentTheme.accent} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                background: currentTheme.card,
                borderRadius: '20px',
                padding: '24px',
                border: `2px solid ${currentTheme.secondary}`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: currentTheme.accent,
                  marginBottom: '8px'
                }}>
                  {userChallenges.length}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: currentTheme.text + '99',
                  fontWeight: '500'
                }}>Active Challenges</div>
              </div>
              
              <div style={{
                background: currentTheme.card,
                borderRadius: '20px',
                padding: '24px',
                border: `2px solid ${currentTheme.secondary}`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: currentTheme.accent,
                  marginBottom: '8px'
                }}>
                  {completions.filter(c => c.userId === currentUser.id).length}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: currentTheme.text + '99',
                  fontWeight: '500'
                }}>Total Completions</div>
              </div>
              
              <div style={{
                background: currentTheme.card,
                borderRadius: '20px',
                padding: '24px',
                border: `2px solid ${currentTheme.secondary}`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: currentTheme.accent,
                  marginBottom: '8px'
                }}>
                  {Math.round((completions.filter(c => c.userId === currentUser.id).length / Math.max(userChallenges.length, 1)) * 100)}%
                </div>
                <div style={{
                  fontSize: '14px',
                  color: currentTheme.text + '99',
                  fontWeight: '500'
                }}>Completion Rate</div>
              </div>
            </div>
          </div>
        )}
        
        {/* My Habits Page */}
        {currentPage === 'habits' && (
          <div style={{
            background: currentTheme.card,
            borderRadius: '24px',
            padding: '32px',
            border: `2px solid ${currentTheme.secondary}`
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: currentTheme.text,
              marginBottom: '24px'
            }}>My Active Habits</h3>
            
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {challenges.filter(c => userChallenges.includes(c.id)).map(challenge => {
                const challengeCompletions = completions.filter(comp => 
                  comp.userId === currentUser.id && comp.challengeId === challenge.id
                );
                
                return (
                  <div key={challenge.id} style={{
                    background: currentTheme.background,
                    borderRadius: '16px',
                    padding: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: currentTheme.text,
                          margin: '0 0 6px'
                        }}>{challenge.title}</h4>
                        <p style={{
                          fontSize: '14px',
                          color: currentTheme.text + '99',
                          margin: 0
                        }}>{challenge.description}</p>
                      </div>
                      
                      <div style={{
                        textAlign: 'right'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: currentTheme.accent
                        }}>
                          {challengeCompletions.length}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: currentTheme.text + '88'
                        }}>days completed</div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {challengeCompletions.slice(-10).map(comp => (
                        <div
                          key={comp.id}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: `2px solid ${currentTheme.secondary}`,
                            cursor: 'pointer'
                          }}
                          title={new Date(comp.timestamp).toLocaleDateString()}
                        >
                          {comp.photo && (
                            <img 
                              src={comp.photo} 
                              alt="Completion" 
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {userChallenges.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: currentTheme.text + '88'
                }}>
                  <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    You haven't joined any challenges yet
                  </p>
                  <button
                    onClick={() => setCurrentPage('challenges')}
                    style={{
                      marginTop: '16px',
                      padding: '12px 24px',
                      background: currentTheme.accent,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    Browse Challenges
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Page */}
        {currentPage === 'settings' && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${currentTheme.secondary}`,
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '24px'
              }}>Profile Settings</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentTheme.text,
                  marginBottom: '8px'
                }}>Name</label>
                <input
                  type="text"
                  defaultValue={currentUser?.name}
                  onBlur={(e) => updateProfile({ name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${currentTheme.secondary}`,
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentTheme.text,
                  marginBottom: '8px'
                }}>Email</label>
                <input
                  type="email"
                  value={currentUser?.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${currentTheme.secondary}`,
                    fontSize: '16px',
                    outline: 'none',
                    background: currentTheme.background,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    opacity: 0.7
                  }}
                />
              </div>
            </div>
            
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${currentTheme.secondary}`,
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '16px'
              }}>Theme</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {Object.keys(themes).map(themeName => (
                  <div
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: `2px solid ${theme === themeName ? themes[themeName].accent : currentTheme.secondary}`,
                      cursor: 'pointer',
                      background: theme === themeName ? `${themes[themeName].primary}22` : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: themes[themeName].primary
                      }} />
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: themes[themeName].accent
                      }} />
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: currentTheme.text,
                      textTransform: 'capitalize'
                    }}>
                      {themeName.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              background: currentTheme.card,
              borderRadius: '24px',
              padding: '32px',
              border: `2px solid ${currentTheme.secondary}`
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '16px'
              }}>Danger Zone</h3>
              
              <button
                onClick={resetProgress}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#FFE5E5',
                  color: '#FF4444',
                  border: '2px solid #FFCCCC',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Reset All Progress
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: currentTheme.card,
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                margin: 0
              }}>Create New Challenge</h3>
              <button
                onClick={() => setShowCreateChallenge(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} color={currentTheme.text} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '8px'
              }}>Challenge Title</label>
              <input
                type="text"
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                placeholder="e.g., 30-Day Yoga Challenge"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme.secondary}`,
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '8px'
              }}>Description</label>
              <textarea
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                placeholder="Describe your challenge..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme.secondary}`,
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: currentTheme.text,
                marginBottom: '8px'
              }}>Category</label>
              <input
                type="text"
                value={newChallenge.category}
                onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                placeholder="e.g., Fitness, Wellness, Learning"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme.secondary}`,
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <button
              onClick={handleCreateChallenge}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Create Challenge
            </button>
          </div>
        </div>
      )}
      
      {/* Complete Challenge Modal */}
      {selectedChallenge && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: currentTheme.card,
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                margin: 0
              }}>Complete Challenge</h3>
              <button
                onClick={() => {
                  setSelectedChallenge(null);
                  setCompletionPhoto(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} color={currentTheme.text} />
              </button>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: currentTheme.text + '99',
              marginBottom: '24px'
            }}>
              Upload a photo to verify completion and earn 10 points!
            </p>
            
            <div style={{
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                id="photo-upload"
                style={{ display: 'none' }}
              />
              
              {completionPhoto ? (
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `2px solid ${currentTheme.secondary}`,
                  marginBottom: '16px'
                }}>
                  <img 
                    src={completionPhoto} 
                    alt="Completion" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ) : (
                <label
                  htmlFor="photo-upload"
                  style={{
                    display: 'block',
                    padding: '48px 24px',
                    background: currentTheme.background,
                    borderRadius: '16px',
                    border: `2px dashed ${currentTheme.secondary}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.primary;
                    e.currentTarget.style.background = `${currentTheme.primary}11`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.secondary;
                    e.currentTarget.style.background = currentTheme.background;
                  }}
                >
                  <Upload size={48} color={currentTheme.accent} style={{ marginBottom: '16px' }} />
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: currentTheme.text,
                    marginBottom: '8px'
                  }}>Click to upload photo</div>
                  <div style={{
                    fontSize: '14px',
                    color: currentTheme.text + '88'
                  }}>Required to earn points</div>
                </label>
              )}
              
              {completionPhoto && (
                <button
                  onClick={() => setCompletionPhoto(null)}
                  style={{
                    padding: '10px 20px',
                    background: currentTheme.background,
                    color: currentTheme.text,
                    border: `2px solid ${currentTheme.secondary}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Change Photo
                </button>
              )}
            </div>
            
            <button
              onClick={() => completeChallenge(selectedChallenge, completionPhoto)}
              disabled={!completionPhoto}
              style={{
                width: '100%',
                padding: '14px',
                background: completionPhoto 
                  ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})` 
                  : currentTheme.background,
                color: completionPhoto ? 'white' : currentTheme.text + '88',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: completionPhoto ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                opacity: completionPhoto ? 1 : 0.5
              }}
            >
              Complete & Earn 10 Points
            </button>
          </div>
        </div>
      )}
      
      {/* Chat Room Modal */}
      {showChatRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: currentTheme.card,
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: currentTheme.text,
                margin: 0
              }}>
                {challenges.find(c => c.id === showChatRoom)?.title} - Chat
              </h3>
              <button
                onClick={() => setShowChatRoom(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={24} color={currentTheme.text} />
              </button>
            </div>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '16px',
              padding: '16px',
              background: currentTheme.background,
              borderRadius: '16px'
            }}>
              {(chatMessages[showChatRoom] || []).map(msg => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '16px',
                    padding: '12px 16px',
                    background: msg.userId === currentUser.id ? currentTheme.primary : currentTheme.card,
                    borderRadius: '12px',
                    maxWidth: '80%',
                    marginLeft: msg.userId === currentUser.id ? 'auto' : 0,
                    marginRight: msg.userId === currentUser.id ? 0 : 'auto'
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: currentTheme.text + 'AA',
                    marginBottom: '4px'
                  }}>
                    {msg.userName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: currentTheme.text
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}
              
              {(!chatMessages[showChatRoom] || chatMessages[showChatRoom].length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: currentTheme.text + '88'
                }}>
                  <MessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                placeholder="Type a message..."
                id={`chat-input-${showChatRoom}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    sendChatMessage(showChatRoom, e.target.value);
                    e.target.value = '';
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme.secondary}`,
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById(`chat-input-${showChatRoom}`);
                  if (input.value.trim()) {
                    sendChatMessage(showChatRoom, input.value);
                    input.value = '';
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: currentTheme.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTrackerApp;
