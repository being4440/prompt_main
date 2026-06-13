import { moodOptions } from './constants';

/**
 * Returns an appropriate greeting based on the current hour.
 * @returns {string} The greeting string (e.g., "Good morning").
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Calculates the number of days remaining until the exam.
 * @param {Object} profile - The student's profile containing examDate.
 * @returns {number} Days remaining (minimum 0).
 */
export const getDaysUntilExam = (profile) => {
  if (!profile?.examDate) return 0;
  return Math.max(0, Math.ceil((new Date(profile.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
};

/**
 * Calculates the consecutive days of logging a mood.
 * @param {Array} logs - The array of check-in logs.
 * @returns {number} The current streak count.
 */
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

/**
 * Calculates the average mood over the last 7 days.
 * @param {Array} logs - The array of check-in logs.
 * @returns {Object} The average mood object (emoji, label).
 */
export const getAvgMood = (logs) => {
  const recent = logs.slice(-7);
  if(recent.length === 0) return { emoji: '—', label: 'No data' };
  const avgScore = Math.round(recent.reduce((acc, l) => acc + l.mood.score, 0) / recent.length);
  return moodOptions.find(m => m.score === avgScore) || moodOptions[2];
};

/**
 * Determines the most common time of day the student checks in.
 * @param {Array} logs - The array of check-in logs.
 * @returns {string} "Morning", "Afternoon", or "Evening".
 */
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

/**
 * Calculates the average score of a specific metric (e.g., energy, focus) within a date range.
 * @param {Array} logs - Check-in logs.
 * @param {number} daysAgoStart - The start of the date range (in days ago).
 * @param {number} daysAgoEnd - The end of the date range (in days ago).
 * @param {string} metric - The key of the metric to average.
 * @returns {number|string} The average metric score, fixed to 1 decimal point.
 */
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

/**
 * Analyzes logs to extract lifestyle correlation insights (Sleep vs Focus, Study Volume).
 * @param {Array} logs - Check-in logs containing sleepHours, studyHours, and focus.
 * @returns {Object|null} The correlation data object or null if insufficient data.
 */
export const calculateCorrelations = (logs) => {
  if (!logs || logs.length === 0) return null;
  const sleepLogs = logs.filter(l => l.sleepHours !== undefined && l.focus !== undefined);
  if (sleepLogs.length === 0) return null;

  let highSleepFocus = 0; let highSleepCount = 0;
  let lowSleepFocus = 0; let lowSleepCount = 0;

  sleepLogs.forEach(l => {
    if (Number(l.sleepHours) >= 7) {
      highSleepFocus += Number(l.focus);
      highSleepCount++;
    } else {
      lowSleepFocus += Number(l.focus);
      lowSleepCount++;
    }
  });

  const avgHigh = highSleepCount > 0 ? (highSleepFocus / highSleepCount).toFixed(1) : '-';
  const avgLow = lowSleepCount > 0 ? (lowSleepFocus / lowSleepCount).toFixed(1) : '-';

  const studyLogs = logs.filter(l => l.studyHours !== undefined);
  const avgStudy = studyLogs.length > 0 
    ? (studyLogs.reduce((acc, curr) => acc + Number(curr.studyHours), 0) / studyLogs.length).toFixed(1) 
    : '-';

  return { avgHighSleepFocus: avgHigh, avgLowSleepFocus: avgLow, avgStudyHours: avgStudy };
};
