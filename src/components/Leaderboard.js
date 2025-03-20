import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000');
    
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'LEADERBOARD_UPDATE') {
        setLeaderboard(data.leaderboard);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      socket.close();
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr 
                key={player._id} 
                className={currentUser && player._id === currentUser._id ? 'current-user' : ''}
              >
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.correctPredictions}</td>
                <td>{player.wrongPredictions}</td>
                <td>{player.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;