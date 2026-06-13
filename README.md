# 🌿 MoodMate

MoodMate is a premium, AI-powered mental wellness companion designed specifically for students facing exam stress (JEE, NEET, UPSC, etc.). It acts as a safe space to log daily emotions, measure cognitive fatigue (Energy, Focus, Confidence), and receive deeply empathetic, actionable advice from a virtual AI companion.

![MoodMate Dashboard](https://via.placeholder.com/1000x500.png?text=MoodMate+Dashboard) *(You can replace this with a real screenshot of the app)*

## ✨ Features

- **Beautiful, Premium Interface:** Fully responsive desktop dashboard and mobile app layout featuring glassmorphism, animated gradients, and custom SVGs.
- **Privacy First:** 100% of your profile, logs, and streaks are securely saved directly in your browser's `localStorage`.
- **3-Step Daily Check-ins:** 
  1. Pick your core emotion.
  2. Set your Energy, Focus, and Confidence levels via interactive sliders.
  3. Respond to a randomly generated journaling prompt.
- **Empathetic AI Companion:** Powered by Google's Gemini 2.5 Flash, the Chat Assistant acts as a supportive peer, offering specific exam-coping mechanisms (e.g., box breathing, Pomodoro tips) based on your recent check-in history.
- **Rich Analytics Dashboard:** 
  - 14-day visual Mood Timeline grid.
  - Quick stat cards (Streak, Avg Mood, Common Check-in Time).
  - Pure CSS horizontal bar charts comparing your focus and energy trends (This Week vs. Last Week).
  - **AI Weekly Insight:** Let Gemini analyze your last 7 days to identify emotional patterns, stress triggers, and custom recommendations.

## 🛠 Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Zero external UI libraries used; fully custom components)
- **AI Integration:** `@google/generative-ai` SDK (Gemini 2.5 Flash)
- **State Management:** React Hooks (`useState`, `useEffect`) + `localStorage`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository** (if using Git) or download the folder:
   ```bash
   git clone <repository-url>
   cd moodmate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port provided by Vite).

## 📂 Project Structure

MoodMate is built with a highly modular and scalable directory structure:

```text
src/
├── components/
│   ├── icons/        # Custom inline SVG icons
│   ├── layout/       # App layout components (Sidebar, MobileNav, Header)
│   └── screens/      # Core views (Onboarding, Home, CheckIn, Chat, Dashboard)
├── utils/
│   ├── constants.js  # Static data (quotes, prompts, mood objects)
│   ├── gemini.js     # Google SDK configuration and system prompts
│   └── helpers.js    # Logic for calculating streaks, averages, and days left
├── App.jsx           # Main router and global state holder
├── index.css         # Tailwind initialization and global styles
└── main.jsx          # React DOM entry point
```

## 🧠 Future Enhancements (Ideas)
- **Dark Mode:** Add an automatic dark mode toggle for late-night study sessions.
- **Voice Input:** Use the Web Speech API to let students talk to MoodMate instead of typing.
- **Export Data:** Allow students to download their journal entries as a PDF or CSV.

---
*Built with ❤️ for students everywhere.*
