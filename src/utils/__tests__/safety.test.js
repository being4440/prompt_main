import { detectCrisisKeywords } from '../safety';

describe('safety.js utility functions', () => {
  
  test('detectCrisisKeywords returns true for high-risk text', () => {
    expect(detectCrisisKeywords("I just want to end my life")).toBe(true);
    expect(detectCrisisKeywords("thinking about suicide")).toBe(true);
    expect(detectCrisisKeywords("I might hurt myself")).toBe(true);
    expect(detectCrisisKeywords("feeling worthless today")).toBe(true);
  });

  test('detectCrisisKeywords returns false for normal text', () => {
    expect(detectCrisisKeywords("I had a bad day")).toBe(false);
    expect(detectCrisisKeywords("feeling anxious about exams")).toBe(false);
    expect(detectCrisisKeywords("")).toBe(false);
    expect(detectCrisisKeywords(null)).toBe(false);
  });

  test('detectCrisisKeywords is case-insensitive', () => {
    expect(detectCrisisKeywords("SuIcIdE is not the answer but I feel like it")).toBe(true);
    expect(detectCrisisKeywords("KILL MYSELF")).toBe(true);
  });

});
