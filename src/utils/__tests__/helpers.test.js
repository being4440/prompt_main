import { getStreak, getAvgMood, calculateCorrelations } from '../helpers';

describe('helpers.js utility functions', () => {
  
  test('getStreak calculates consecutive days correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);
    
    const logs = [
      { timestamp: today.toISOString() },
      { timestamp: yesterday.toISOString() },
      { timestamp: dayBefore.toISOString() }
    ];
    
    expect(getStreak(logs)).toBe(3);
  });

  test('getStreak handles missing today log but active yesterday streak', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const logs = [
      { timestamp: yesterday.toISOString() }
    ];
    
    // Streak is still 1 if they haven't logged today yet, but logged yesterday.
    expect(getStreak(logs)).toBe(1);
  });

  test('getAvgMood correctly aggregates mood scores', () => {
    const logs = [
      { mood: { score: 1 } }, // Struggling
      { mood: { score: 5 } }  // Great
    ];
    // (1 + 5) / 2 = 3. 3 is Neutral.
    const avg = getAvgMood(logs);
    expect(avg.score).toBe(3);
    expect(avg.label).toBe('Neutral');
  });

  test('calculateCorrelations handles empty logs', () => {
    expect(calculateCorrelations([])).toBeNull();
  });

  test('calculateCorrelations computes sleep vs focus averages', () => {
    const logs = [
      { sleepHours: 8, focus: 8 },
      { sleepHours: 7, focus: 6 },
      { sleepHours: 5, focus: 4 },
      { studyHours: 2 } // No sleep/focus data
    ];
    
    const result = calculateCorrelations(logs);
    expect(result.avgHighSleepFocus).toBe("7.0"); // (8+6)/2
    expect(result.avgLowSleepFocus).toBe("4.0");  // 4/1
  });

});
