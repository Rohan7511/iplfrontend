import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="burger-button" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="logo">Predict the Winner</div>
      </div>
      
      {currentUser && (
        <div className="navbar-right" ref={profileMenuRef}>
          <button className="profile-button" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <FaUser />
          </button>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <Link to="/profile" onClick={() => setShowProfileMenu(false)}>
                Profile
              </Link>
              <div className="theme-toggle">
                <span>Dark Mode</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={toggleTheme}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;