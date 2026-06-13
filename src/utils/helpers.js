import { moodOptions } from './constants';

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const getDaysUntilExam = (profile) => {
  if (!profile?.examDate) return 0;
  return Math.max(0, Math.ceil((new Date(profile.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
};

export const getStreak = (logs) => {
  let streak = 0;
  let currDate = new Date();
  currDate.setHours(0,0,0,0);
  
  const sorted = [...logs].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  let foundToday = sorted.some(l => {
    let d = new Date(l.timestamp);
    d.setHours(0,0,0,0);
    return d.getTime() === currDate.getTime();
  });

  if(!foundToday) {
    currDate.setDate(currDate.getDate() - 1);
  }

  while(true) {
    let found = sorted.some(l => {
      let d = new Date(l.timestamp);
      d.setHours(0,0,0,0);
      return d.getTime() === currDate.getTime();
    });
    if(found) {
      streak++;
      currDate.setDate(currDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getAvgMood = (logs) => {
  const recent = logs.slice(-7);
  if(recent.length === 0) return { emoji: '—', label: 'No data' };
  const avgScore = Math.round(recent.reduce((acc, l) => acc + l.mood.score, 0) / recent.length);
  return moodOptions.find(m => m.score === avgScore) || moodOptions[2];
};

export const getCommonTime = (logs) => {
  const recent = logs.slice(-7);
  if(recent.length === 0) return '—';
  let counts = { morning: 0, afternoon: 0, evening: 0 };
  recent.forEach(l => {
    let h = new Date(l.timestamp).getHours();
    if(h < 12) counts.morning++;
    else if(h < 18) counts.afternoon++;
    else counts.evening++;
  });
  const max = Math.max(counts.morning, counts.afternoon, counts.evening);
  if(max === counts.morning) return 'Morning';
  if(max === counts.afternoon) return 'Afternoon';
  return 'Evening';
};

export const getAvgMetric = (logs, daysAgoStart, daysAgoEnd, metric) => {
  let sum = 0; let count = 0;
  const now = new Date();
  logs.forEach(l => {
    const d = new Date(l.timestamp);
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if(diffDays >= daysAgoStart && diffDays <= daysAgoEnd) {
      sum += l[metric];
      count++;
    }
  });
  return count === 0 ? 0 : (sum / count).toFixed(1);
};
