/**
 * Utility functions for detecting crisis keywords in user inputs.
 */

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "want to die", "end my life", 
  "harm myself", "hurt myself", "cut myself", "give up on life",
  "no reason to live"
];

/**
 * Detects if the provided text contains any high-risk crisis keywords.
 * @param {string} text - The input text to analyze.
 * @returns {boolean} True if a crisis keyword is found, false otherwise.
 */
export const detectCrisisKeywords = (text) => {
  if (!text || typeof text !== 'string') return false;
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
};
