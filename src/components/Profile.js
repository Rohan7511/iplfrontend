// src/components/Profile.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      await updateProfile({ name });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Total Points:</strong> {currentUser.totalPoints || 0}</p>
          <p><strong>Correct Predictions:</strong> {currentUser.correctPredictions || 0}</p>
          <p><strong>Wrong Predictions:</strong> {currentUser.wrongPredictions || 0}</p>
        </div>
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Update Profile</h2>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="profile-button"
            disabled={loading}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;