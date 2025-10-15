
import React, { useState, useEffect, useRef } from 'react';

const formatSeconds = (sec: number): string => {
  const roundedSec = Math.floor(sec);
  const h = Math.floor(roundedSec / 3600);
  const m = Math.floor((roundedSec % 3600) / 60);
  const s = roundedSec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const AuxTracker: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [pressCount, setPressCount] = useState(0);
  
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleToggle = () => {
    if (!isRunning) {
      // Start
      startTimeRef.current = new Date();
      setIsRunning(true);
      setPressCount(prev => prev + 1);
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date();
          const elapsed = (now.getTime() - startTimeRef.current.getTime()) / 1000;
          setCurrentSessionSeconds(elapsed);
        }
      }, 1000);
    } else {
      // Stop
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      setTotalSeconds(prev => prev + currentSessionSeconds);
      setCurrentSessionSeconds(0);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-700 mb-4">Others AUX Tracker</h3>
      <div className="space-y-3">
        <button
          onClick={handleToggle}
          className={`w-48 px-4 py-2 text-white font-bold rounded-md transition-colors ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'
          }`}
        >
          {isRunning ? 'Stop Others AUX' : 'Start Others AUX'}
        </button>
        <div className="font-mono text-slate-600">
          <p>Current Session: {formatSeconds(currentSessionSeconds)}</p>
          <p>Total Unbilled Hours: {formatSeconds(totalSeconds + currentSessionSeconds)}</p>
          <p>Times Activated: {pressCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AuxTracker;
