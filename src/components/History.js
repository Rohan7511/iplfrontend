import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();

    const socket = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'HISTORY_UPDATE' && data.userId === currentUser?._id) {
        setPredictions(data.predictions);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [currentUser]);

  const fetchHistory = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const res = await api.get('/predictions/user');
      setPredictions(res.data);
    } catch (err) {
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="history-container">
        <h1>Prediction History</h1>
        <div className="error-message">Please login to view your prediction history</div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="history-container">
        <h1>Prediction History</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1>Prediction History</h1>

      {predictions.length === 0 ? (
        <div className="no-data">You haven't made any predictions yet</div>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team 1</th>
                <th>Team 2</th>
                <th>Your Prediction</th>
                <th>Winner</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction._id}>
                  <td>
                    {prediction?.game?.gameTime
                      ? new Date(prediction.game.gameTime).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>{prediction?.game?.team1?.name || 'N/A'}</td>
                  <td>{prediction?.game?.team2?.name || 'N/A'}</td>
                  <td>
                    {prediction?.teamSelected
                      ? prediction.teamSelected === prediction?.game?.team1?._id
                        ? prediction?.game?.team1?.name
                        : prediction?.game?.team2?.name
                      : 'N/A'}
                  </td>
                  <td>
                    {prediction?.game?.winner
                      ? prediction.game.winner === prediction?.game?.team1?._id
                        ? prediction?.game?.team1?.name
                        : prediction?.game?.team2?.name
                      : 'Not decided'}
                  </td>
                  <td>
                    {!prediction?.game?.winner
                      ? '-'
                      : prediction.teamSelected === prediction?.game?.winner
                        ? <span className="correct">Correct</span>
                        : <span className="wrong">Wrong</span>}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default History;
