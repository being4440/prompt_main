// Static dataset of Bhagavad Geeta quotes categorized by mood themes

const quotes = [
  // For 'Struggling' / 'Anxious' - Focus on peace, detachment from results, perseverance
  {
    text: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    chapter: "Chapter 2, Verse 47",
    theme: "Anxious"
  },
  {
    text: "For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy.",
    chapter: "Chapter 6, Verse 6",
    theme: "Struggling"
  },
  {
    text: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind.",
    chapter: "Chapter 2, Verse 56",
    theme: "Anxious"
  },

  // For 'Neutral' / 'Okay' - Focus on duty, steady effort, and self-belief
  {
    text: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
    chapter: "Chapter 2, Verse 48",
    theme: "Neutral"
  },
  {
    text: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner. Because each person is his own friend or enemy.",
    chapter: "Chapter 6, Verse 5",
    theme: "Okay"
  },
  {
    text: "No one who does good work will ever come to a bad end, either here or in the world to come.",
    chapter: "Chapter 6, Verse 40",
    theme: "Okay"
  },

  // For 'Great' - Focus on joy, gratitude, higher purpose
  {
    text: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
    chapter: "Chapter 6, Verse 19",
    theme: "Great"
  },
  {
    text: "There is nothing lost or wasted in this life.",
    chapter: "Chapter 2, Verse 40",
    theme: "Great"
  }
];

export function getGeetaQuote(moodLabel) {
  let applicableQuotes = quotes;
  
  if (moodLabel === 'Struggling' || moodLabel === 'Anxious') {
    applicableQuotes = quotes.filter(q => q.theme === 'Anxious' || q.theme === 'Struggling');
  } else if (moodLabel === 'Neutral' || moodLabel === 'Okay') {
    applicableQuotes = quotes.filter(q => q.theme === 'Neutral' || q.theme === 'Okay');
  } else if (moodLabel === 'Great') {
    applicableQuotes = quotes.filter(q => q.theme === 'Great');
  }

  // Fallback if empty
  if (applicableQuotes.length === 0) applicableQuotes = quotes;

  // Pick a random one
  const randomIndex = Math.floor(Math.random() * applicableQuotes.length);
  return applicableQuotes[randomIndex];
}
