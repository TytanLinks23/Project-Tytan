
import React, { useState, useEffect, useMemo } from 'react';
import { AppProps } from '../types';

const parseHHMM = (tstr: string): { h: number; m: number } | null => {
  try {
    const parts = tstr.trim().split(":");
    if (parts.length !== 2) return null;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m) && 0 <= h && h < 24 && 0 <= m && m < 60) {
      return { h, m };
    }
  } catch (e) {
    return null;
  }
  return null;
};

const todayDT = (h: number, m: number): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
};

const secondsToHMS = (sec: number): string => {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

interface BreakInfo {
  duration: number; // in minutes
  time: string;
  scheduled: Date | null;
  onBreak: boolean;
  end: Date | null;
  prewarned: boolean;
}

const BreakTracker: React.FC<AppProps> = ({ showModal }) => {
  const [shiftStart, setShiftStart] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [breaks, setBreaks] = useState<{ [key: string]: BreakInfo }>({
    '1st Break': { duration: 15, time: '', scheduled: null, onBreak: false, end: null, prewarned: false },
    'Lunch': { duration: 60, time: '', scheduled: null, onBreak: false, end: null, prewarned: false },
    '2nd Break': { duration: 15, time: '', scheduled: null, onBreak: false, end: null, prewarned: false },
  });
  const [isLocked, setIsLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prewarnEnabled, setPrewarnEnabled] = useState(true);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isLocked]);
  
  useEffect(() => {
    if (!isLocked) return;

    const newBreaks = { ...breaks };
    let changed = false;

    Object.entries(newBreaks).forEach(([key, info]) => {
      if (!info.scheduled) return;

      const now = currentTime.getTime();
      const schedTime = info.scheduled.getTime();
      const secsUntil = (schedTime - now) / 1000;

      if (info.onBreak && info.end) {
        if (now >= info.end.getTime()) {
          info.onBreak = false;
          info.scheduled.setDate(info.scheduled.getDate() + 1); // schedule for next day
          info.prewarned = false;
          showModal("Break Over", `Your ${key} is over. Please return to work.`);
          changed = true;
        }
      } else {
        if (secsUntil <= 0 && !info.onBreak) {
          info.onBreak = true;
          info.end = new Date(schedTime + info.duration * 60 * 1000);
          showModal("Break Start", `It's time for your ${key}.`);
          changed = true;
        } else if (prewarnEnabled && secsUntil > 0 && secsUntil <= 300 && !info.prewarned) {
          info.prewarned = true;
          showModal("Break Reminder", `${key} starts in ${Math.round(secsUntil/60)} minutes.`);
          changed = true;
        }
      }
    });

    if (changed) {
      setBreaks(newBreaks);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, isLocked]);

  const handleBreakTimeChange = (key: string, value: string) => {
    setBreaks(prev => ({ ...prev, [key]: { ...prev[key], time: value } }));
  };

  const handleSubmitBreaks = () => {
    const now = new Date();
    const scheduledBreaks = { ...breaks };
    for (const key in scheduledBreaks) {
      const parsed = parseHHMM(scheduledBreaks[key].time);
      if (parsed) {
        let dt = todayDT(parsed.h, parsed.m);
        if (dt <= now) {
          dt.setDate(dt.getDate() + 1);
        }
        scheduledBreaks[key].scheduled = dt;
        scheduledBreaks[key].prewarned = false;
        scheduledBreaks[key].onBreak = false;
      }
    }
    setBreaks(scheduledBreaks);
    setIsLocked(true);
    showModal("Break Times Saved", "Break schedules submitted and locked for this session.");
  };
  
  const ProgressDisplay = ({ breakKey, info }: { breakKey: string, info: BreakInfo }) => {
    const { label, percentage } = useMemo(() => {
        if (!info.scheduled) {
            return { label: "Time left: --:--", percentage: 0 };
        }
        const now = currentTime.getTime();
        if (info.onBreak && info.end) {
            const secsLeft = (info.end.getTime() - now) / 1000;
            const total = info.duration * 60;
            const elapsed = total - secsLeft;
            const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));
            return { label: `Break remaining: ${secondsToHMS(secsLeft)}`, percentage: pct };
        } else {
            const secsUntil = (info.scheduled.getTime() - now) / 1000;
            const start = parseHHMM(shiftStart);
            const shiftDT = start ? todayDT(start.h, start.m) : new Date(new Date().setHours(0,0,0,0));
            const totalSeconds = (info.scheduled.getTime() - shiftDT.getTime()) / 1000;
            const elapsedSeconds = (now - shiftDT.getTime()) / 1000;
            const pct = totalSeconds > 0 ? Math.max(0, Math.min(100, (elapsedSeconds / totalSeconds) * 100)) : 0;
            return { label: `Time left: ${secondsToHMS(secsUntil)}`, percentage: pct };
        }
    }, [info, currentTime, shiftStart]);

    return (
        <div>
            <label className="text-sm font-medium text-slate-600">{breakKey} Progress:</label>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-700 mb-4">Break Dashboard</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Shift Start (HH:MM):</label>
          <input type="text" value={shiftStart} onChange={e => setShiftStart(e.target.value)} disabled={isLocked} className="w-24 p-2 border border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" />
        </div>

        {Object.entries(breaks).map(([key, info]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-600 mb-1">{key} (HH:MM 24-hr):</label>
            <input type="text" value={info.time} onChange={e => handleBreakTimeChange(key, e.target.value)} disabled={isLocked} className="w-24 p-2 border border-slate-300 rounded-md shadow-sm disabled:bg-slate-100" />
          </div>
        ))}
        
        <button onClick={handleSubmitBreaks} disabled={isLocked} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
            {isLocked ? 'Breaks Locked' : 'Submit Break Times'}
        </button>

        <div className="pt-4 space-y-4">
            {Object.entries(breaks).map(([key, info]) => (
                <ProgressDisplay key={key} breakKey={key} info={info} />
            ))}
        </div>
        
        <div className="flex items-center pt-2">
            <input type="checkbox" id="prewarn" checked={prewarnEnabled} onChange={e => setPrewarnEnabled(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="prewarn" className="ml-2 block text-sm text-slate-700">5-minute pre-warning</label>
        </div>
      </div>
    </div>
  );
};

export default BreakTracker;
