import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaHistory, FaBook, FaLock } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAdmin } = useContext(AuthContext);
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-button" onClick={toggleSidebar}>×</button>
      </div>
      
      <ul className="sidebar-menu">
        <li>
          <Link to="/" onClick={toggleSidebar}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/leaderboard" onClick={toggleSidebar}>
            <FaTrophy /> Leaderboard
          </Link>
        </li>
        <li>
          <Link to="/history" onClick={toggleSidebar}>
            <FaHistory /> History
          </Link>
        </li>
        <li>
          <Link to="/rules" onClick={toggleSidebar}>
            <FaBook /> Rules
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin" onClick={toggleSidebar}>
              <FaLock /> Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;