import React from 'react';

const Rules = () => {
  return (
    <div className="rules-container">
      <h1>Game Rules</h1>
      
      <div className="rules-content">
        <div className="rule-section">
          <h2>How to Play</h2>
          <ol>
            <li>Login to your account or sign up if you don't have one.</li>
            <li>On the main page, you'll see the upcoming match between two teams.</li>
            <li>Select the team you predict will win by clicking on the corresponding button.</li>
            <li>Once you've made your prediction, you cannot change it.</li>
            <li>After the match is over, the admin will declare the winner.</li>
            <li>Points will be awarded based on your prediction accuracy.</li>
          </ol>
        </div>
        
        <div className="rule-section">
          <h2>Scoring System</h2>
          <ul>
            <li>Correct prediction: +10 points</li>
            <li>Incorrect prediction: 0 points</li>
          </ul>
        </div>
        
        <div className="rule-section">
          <h2>Leaderboard</h2>
          <p>
            The leaderboard ranks all players based on their total points.
            It updates automatically after each game result is declared.
          </p>
        </div>
        
        <div className="rule-section">
          <h2>Important Notes</h2>
          <ul>
            <li>You must make your prediction before the game starts.</li>
            <li>Only one prediction is allowed per game.</li>
            <li>The administrator's decision on game results is final.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rules;