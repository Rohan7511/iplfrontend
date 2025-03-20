import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainPage from './components/MainPage';
import Leaderboard from './components/Leaderboard';
import History from './components/History';
import Rules from './components/Rules';
import Admin from './components/Admin';
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './styles/main.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="content-container">
              <Routes>
                <Route path="/" element={<LoginRedirect />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Component to handle login and redirection
const LoginRedirect = () => {
  const { currentUser } = useContext(AuthContext);
  
  return currentUser ? <Navigate to="/main" /> : <Login />;
};

export default App;
