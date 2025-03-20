import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const MainPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCurrentGame();
  }, []);

  const fetchCurrentGame = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/games'); 
      const activeGame = res.data.find(game => game.isCurrent);

      if (!activeGame) throw new Error('No active game found');
      setCurrentGame(activeGame);

      console.log("Game Fetched:", activeGame);
      
      // Fetch user prediction
      if (currentUser) {
        try {
          const predRes = await api.get(`/predictions/game/${activeGame._id}`);
          if (predRes.data) setPrediction(predRes.data.teamSelected);
        } catch (err) {
          console.warn("No prediction found for this user");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching games');
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const makePrediction = async (teamId) => {
    if (!currentUser) {
      setError('Please login to make a prediction');
      return;
    }
  
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed. Please log in again.');
      setSubmitting(false);
      return;
    }

    const requestData = {
      gameId: currentGame?._id,
      teamSelected: teamId
    };

    try {
      console.log('Sending prediction:', requestData);

      const res = await api.post('/predictions', requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Prediction response:', res.data);

      setPrediction(teamId);
      setSuccessMessage('Your prediction has been recorded!');
    } catch (err) {
      console.error('Error submitting prediction:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to submit prediction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error && !currentGame) {
    return (
      <div className="main-container">
        <h1>Predict the Winner</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1>Predict the Winner</h1>

      {currentGame && (
        <div className="game-container">
          <div className="teams-display">
            <div className="team">
              <img
                src={currentGame.team1.logo || '/placeholder-logo.png'}
                alt={currentGame.team1.name}
                className="team-logo"
              />
              <div className="team-name">{currentGame.team1.name}</div>
            </div>

            <div className="vs">VS</div>

            <div className="team">
              <div className="team-name">{currentGame.team2.name}</div>
              <img
                src={currentGame.team2.logo || '/placeholder-logo.png'}
                alt={currentGame.team2.name}
                className="team-logo"
              />
            </div>
          </div>

          <div className="game-time">
            Game Time: {new Date(currentGame.gameTime).toLocaleString()}
          </div>

          {new Date(currentGame.gameTime) > new Date() ? (
            <>
              <h2>Select your prediction:</h2>

              {successMessage && <div className="success-message">{successMessage}</div>}
              {error && <div className="error-message">{error}</div>}

              <div className="prediction-buttons">
                <button
                  className={`prediction-button ${prediction === currentGame.team1._id ? 'selected' : ''}`}
                  onClick={() => makePrediction(currentGame.team1._id)}
                  disabled={submitting || prediction !== null}
                >
                  {currentGame.team1.name}
                </button>

                <button
                  className={`prediction-button ${prediction === currentGame.team2._id ? 'selected' : ''}`}
                  onClick={() => makePrediction(currentGame.team2._id)}
                  disabled={submitting || prediction !== null}
                >
                  {currentGame.team2.name}
                </button>
              </div>

              {prediction && (
                <div className="prediction-made">
                  Your prediction: <strong>{prediction === currentGame.team1._id ? currentGame.team1.name : currentGame.team2.name}</strong>
                </div>
              )}
            </>
          ) : (
            <div className="game-status">
              {currentGame.winner ? (
                <div className="winner-announced">
                  Winner: {currentGame.winner === currentGame.team1._id ? currentGame.team1.name : currentGame.team2.name}
                </div>
              ) : (
                <div className="waiting-result">
                  Game in progress. Waiting for results...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
