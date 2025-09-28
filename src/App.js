import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [targetHour, setTargetHour] = useState(0);
  const [targetMinute, setTargetMinute] = useState(0);
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (!isTimerActive) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(targetHour, targetMinute, 0, 0);

      // If target time is in the past for today, set it for tomorrow
      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      let diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setIsTimerActive(false);
        clearInterval(interval);
        return;
      }

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetHour, targetMinute, isTimerActive]);

  const handleTimeChange = (setter, value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setter(numericValue);
      if (!isTimerActive) {
        setIsTimerActive(true);
      }
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <div className={`App ${theme}`}>
        <div className="countdown-container">
          <div className="controls">
            <span>Countdown to</span>
            <input
              type="number"
              value={String(targetHour).padStart(2, '0')}
              min="0"
              max="23"
              onChange={(e) => handleTimeChange(setTargetHour, e.target.value)}
              aria-label="Target hour"
            />
            <span>:</span>
            <input
              type="number"
              value={String(targetMinute).padStart(2, '0')}
              min="0"
              max="59"
              onChange={(e) => handleTimeChange(setTargetMinute, e.target.value)}
              aria-label="Target minute"
            />
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
          <h1 className="big-timer">{timeLeft}</h1>
        </div>
      </div>
    </>
  );
}

export default App;

