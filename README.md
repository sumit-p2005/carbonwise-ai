# CarbonWise AI

CarbonWise AI is a smart Carbon Footprint Awareness Platform designed to help individuals understand, track, analyze, and reduce their environmental emissions. Powered by personalized AI-driven coaching (EcoBuddy) and a gamified checklist system, the application converts daily behaviors into tangible sustainability scores.

---

## Architecture Overview

CarbonWise AI uses clean separation of concerns:
- **Frontend**: Single Page Application built with **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion** (smooth micro-animations), and **Recharts** (clean visual insights).
- **Backend**: **Node.js + Express.js** server communicating with a robust, file-locked JSON database module.
- **AI Core**: Prioritized recommendation parser and Sustainability Coach conversational agent (supports direct HTTP calls to **Google Gemini 1.5 Flash** or localized NLP matcher fallback).

---

## Features

1. **Interactive Carbon Calculator**: Multi-step range sliding wizards capturing transport distance logs, electrical indices, nutrition profiles, and garbage waste.
2. **AI Sustainability Coach**: Interactive context-aware messaging chatbot styled like ChatGPT.
3. **Daily Eco Challenges**: Complete daily green habits (using reusable bottles, turning off lights) to earn points and boost scores.
4. **Community Leaderboard**: Compare green marks with friends and earn titles ("Carbon Zero Hero", "Green Champion").
5. **PDF Report Export**: Interactive summary page showing progress deltas and pie proportion breakdowns, print-optimized for clean paper/PDF export.

---

## Installation

Run the following command in the project root to install all dependencies for root, backend, and frontend concurrently:

```bash
npm run install-all
```

---

## Running the Application

### Option A: Simultaneous Boot (Recommended)
Launch both developer servers (Express backend on `5000` and Vite client on `5173`) with a single command from the root directory:

```bash
npm run dev
```

### Option B: Separate Process Terminals

**Start the Express Server:**
```bash
cd backend
npm run dev
```

**Start the Vite Frontend:**
```bash
cd frontend
npm run dev
```

---

## Environment Variables

Configure parameters in the `backend/.env` file:

```env
PORT=5000
JWT_SECRET=carbonwise-super-secret-key-13579
GEMINI_API_KEY=your-gemini-api-key-here
```
*Note: If `GEMINI_API_KEY` is left blank, the chatbot falls back to the intelligent context-aware local NLP rules engine.*

---

## Calculations & Assumptions

Standard monthly emissions factor allocations (expressed in kg CO₂):
- **Car Travel**: `0.18 kg` CO₂ per km.
- **Bus Travel**: `0.089 kg` CO₂ per km.
- **Train Travel**: `0.041 kg` CO₂ per km.
- **Walking / Biking**: `0 kg` CO₂ per km.
- **Electricity Consumption**: `0.38 kg` CO₂ per kWh.
- **Waste Generation**: `0.5 kg` CO₂ per kg waste.
- **Vegetarian Diet**: `125 kg` CO₂ per month (~1.5 tons/year).
- **Mixed Diet**: `208 kg` CO₂ per month (~2.5 tons/year).
- **Non-Vegetarian Diet**: `275 kg` CO₂ per month (~3.3 tons/year).

---

## Future Improvements
- **Live Utility APIs**: Sync household energy meters with actual electricity logs.
- **OCR Receipt Scans**: Scan supermarket receipts to automatically extract food emissions.
- **Real-Time GPS Logs**: Sync active walking/biking trips from mobile sensors.
