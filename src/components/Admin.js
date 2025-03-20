import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const Admin = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Create Game Form State
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [gameTime, setGameTime] = useState('');
  const [submittingGame, setSubmittingGame] = useState(false);
  
  // Current Game State
  const [currentGame, setCurrentGame] = useState(null);
  const [winner, setWinner] = useState('');
  const [submittingResult, setSubmittingResult] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchTeams();
      fetchCurrentGame();
    }
  }, [isAdmin]);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentGame = async () => {
    try {
      setLoading(true);
      const res = await api.get('/games');
      const activeGame = res.data.find(game => game.isCurrent);
      
      if (!activeGame) {
        console.log("No active game found.");
        return;
      }
  
      console.log("Fetched Active Game:", activeGame);
      setCurrentGame(activeGame);
    } catch (err) {
      console.error("Error fetching game:", err);
      setError("Failed to fetch current game.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateGame = async (e) => {
    e.preventDefault();
    
    if (team1 === team2) {
      setError('Team 1 and Team 2 cannot be the same');
      return;
    }
    
    try {
      setSubmittingGame(true);
      setError('');
      setSuccessMessage('');
      
      await api.post('/games', {
        team1,
        team2,
        gameTime: new Date(gameTime).toISOString()
      });
      
      setSuccessMessage('Game created successfully!');
      fetchCurrentGame();
      
      // Reset form
      setTeam1('');
      setTeam2('');
      setGameTime('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create game');
    } finally {
      setSubmittingGame(false);
    }
  };

  const handleDeclareWinner = async (e) => {
    e.preventDefault();
    
    if (!winner) {
      setError('Please select a winner');
      return;
    }
    
    try {
      setSubmittingResult(true);
      setError('');
      setSuccessMessage('');
      
      await api.put(`/games/${currentGame._id}/winner`, {
        winner
      });
      
      setSuccessMessage('Winner declared successfully!');
      fetchCurrentGame();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to declare winner');
    } finally {
      setSubmittingResult(false);
    }
  };

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="admin-section">
        <h2>Create New Game</h2>
        <form className="admin-form" onSubmit={handleCreateGame}>
          <div className="form-group">
            <label>Team 1</label>
            <select 
              value={team1} 
              onChange={(e) => setTeam1(e.target.value)}
              required
            >
              <option value="">Select Team 1</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>          </div>
          
          <div className="form-group">
            <label>Team 2</label>
            <select 
              value={team2} 
              onChange={(e) => setTeam2(e.target.value)}
              required
            >
              <option value="">Select Team 2</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Game Time</label>
            <input 
              type="datetime-local" 
              value={gameTime} 
              onChange={(e) => setGameTime(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-button"
            disabled={submittingGame}
          >
            Create Game
          </button>
        </form>
      </div>
      
      
      {currentGame && (
        <div className="admin-section">
          <h2>Declare Winner</h2>
          <div className="current-game-info">
            <p>
              <strong>Game:</strong> {currentGame.team1.name} vs {currentGame.team2.name}
            </p>
            <p>
              <strong>Time:</strong> {new Date(currentGame.gameTime).toLocaleString()}
            </p>
          </div>
          
          <form className="admin-form" onSubmit={handleDeclareWinner}>
            <div className="form-group">
              <label>Winner</label>
              <select 
                value={winner} 
                onChange={(e) => setWinner(e.target.value)}
                required
              >
                <option value="">Select Winner</option>
                <option value={currentGame.team1._id}>{currentGame.team1.name}</option>
                <option value={currentGame.team2._id}>{currentGame.team2.name}</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="admin-button"
              disabled={submittingResult}
            >
              Declare Winner
            </button>
          </form>
        </div>
      )}
      
      <div className="admin-section">
        <h2>Manage Teams</h2>
        <button 
          className="admin-button"
          onClick={() => alert('Team management to be implemented')}
        >
          Add/Edit Teams
        </button>
      </div>
    </div>
  );
};

export default Admin;