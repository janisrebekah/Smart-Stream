# SmartStream – AI-Powered Movie Recommendation System

SmartStream is an AI-powered movie recommendation platform that provides personalized movie suggestions based on user preferences.  
It leverages **Flask**, **scikit-learn**, and **pandas** for the backend, and **React + Vite + Tailwind CSS** for the frontend, with movie metadata sourced from **TMDB**.

---

## Features
- 🎯 **Personalized Recommendations** – Uses ML algorithms to suggest movies based on user choices.
- 📊 **Content-Based Filtering** – Matches similar movies using TMDB dataset features.
- 🖼 **Movie Posters & Metadata** – Fetches visuals and details from TMDB API.
- ⚡ **Fast & Responsive UI** – Built with Vite + React + Tailwind CSS.
- ☁ **Deployed** – Backend on Render, Frontend on Vercel.

---

## Tech Stack
**Frontend**  
- React (Vite)
- Tailwind CSS

**Backend**  
- Flask
- Pandas
- scikit-learn

**Data Source**  
- TMDB Dataset (CSV files)
- TMDB API for movie posters

**Hosting**  
- Backend → [Render](https://smart-stream-qxmy.onrender.com/)  
- Frontend → [Vercel](https://smart-stream-ruddy.vercel.app/)

---

## ⚙️ Installation & Setup

### Clone the repository

- git clone https://github.com/janisrebekah/Smart-Stream.git
- cd SmartStream

## Backend Setup

- cd backend
- pip install -r requirements.txt
- python app.py

## Frontend Setup

- cd frontend
- npm install
- npm run dev


## 🌐 Environment Variables

Create a .env file inside the frontend/ folder:

- VITE_API_BASE_URL=https://smart-stream-qxmy.onrender.com/
- VITE_TMDB_API_KEY=your_tmdb_api_key
