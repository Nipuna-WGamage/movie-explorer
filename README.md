# 🎬 Movie Explorer — Discover Your Favorite Films

A modern, responsive web application built with **React**, **Material-UI (MUI)**, **Axios**, and **The Movie Database (TMDB) API**.

Built for the **Loons Lab Intern Project Challenge**.

---

## 🌟 Key Features

### 1. User Interface (UI)
- **Cinematic Dark & Light Mode**: Seamless theme switching with high-contrast, modern glassmorphic aesthetics and custom typography using Outfit & Plus Jakarta Sans.
- **Hero Spotlight**: Dynamic featured trending title showcase banner.
- **Search Bar**: Real-time keyword search for thousands of movies with clear button and query history.
- **Responsive Movie Grid**: Clean responsive grid (mobile, tablet, desktop) displaying movie posters, titles, release years, and color-coded TMDB ratings.
- **Detailed Movie View (`/movie/:id`)**:
  - Full high-resolution backdrop and poster imagery
  - Release year, formatted runtime, genres, original language, vote average, and vote count
  - Full synopsis and overview
  - Top-billed cast member avatars and crew credits
  - Recommendations and similar movies carousel
- **Trending Section (`/trending`)**: Explore what audiences are watching worldwide with **Today** and **This Week** toggle tabs.
- **User Authentication**:
  - Sign-in interface with username and password
  - One-click demo auto-fill credentials
  - Profile avatar display and menu in the navbar
  - Login state saved to `localStorage`

### 2. State Management & Persistence (React Context API)
- **Favorites Watchlist**:
  - Bookmark movies with instant heart toggle on cards and detail page
  - Dedicated `/favorites` page with search within favorites and "Clear All" confirmation
  - Persisted across page refreshes via `localStorage`
- **Search History & Persistence**:
  - Automatically saves the user's last searched movie query in `localStorage`
  - Quick-access clickable chips for recent searches

### 3. Extra Features (Bonus!)
- **Movie Filtering & Sorting**:
  - Filter by **Genre** (Action, Comedy, Drama, Sci-Fi, Horror, etc.)
  - Filter by **Release Year**
  - Filter by **Minimum Rating** (8+ Masterpieces, 7+ Highly Rated, 6+ Decent)
  - Sort by **Popularity**, **Rating**, **Release Date**, or **Box Office**
- **YouTube Trailer Player**:
  - Direct integration with TMDB video endpoints
  - Embedded YouTube player modal with 16:9 responsive frame and backdrop blur
- **Infinite Scrolling & "Load More" UX**:
  - Seamless toggle between automatic infinite scrolling and explicit "Load More" button for enhanced usability.
- **Graceful Error Handling**:
  - User-friendly error alerts with quick retry actions on network or API failures.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **UI Components & Styling**: Material-UI (MUI v6) (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`)
- **Routing**: React Router v7 (`react-router-dom`)
- **HTTP Client**: Axios
- **Icons**: Material Icons
- **Data Source**: [The Movie Database (TMDB) API](https://developers.themoviedb.org/3)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd movie-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the TMDB API Key:
   The application is pre-configured with the project's TMDB API key in `src/api/tmdb.js`.
   If you wish to use your own key, create a `.env` file or update `src/api/tmdb.js`:
   ```javascript
   const API_KEY = 'YOUR_TMDB_API_KEY';
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
movie-explorer/
├── public/                 # Static assets
├── src/
│   ├── api/
│   │   └── tmdb.js         # TMDB API client with Axios and error handling
│   ├── components/
│   │   ├── CastList.jsx        # Top-billed actors with photos
│   │   ├── ErrorAlert.jsx      # Friendly error notification with retry button
│   │   ├── FilterBar.jsx       # Multi-criteria filtering (genre, year, rating, sort)
│   │   ├── Footer.jsx          # Project attribution & TMDB disclaimer
│   │   ├── LoginModal.jsx      # Authentication modal with credentials & demo fill
│   │   ├── MovieCard.jsx       # Reusable movie card with poster, year, rating, favorite
│   │   ├── MovieGrid.jsx       # Grid layout with skeletons and Load More button
│   │   ├── Navbar.jsx          # Navigation header, theme switcher, favorites counter
│   │   ├── SearchBar.jsx       # Search input with history & persistence chips
│   │   └── TrailerModal.jsx    # Responsive YouTube trailer dialog
│   ├── context/
│   │   ├── AuthContext.jsx         # User login, logout, and profile state
│   │   ├── MovieContext.jsx        # Favorites, last search persistence, genres
│   │   └── ThemeModeContext.jsx    # Dark/Light mode theme state
│   ├── pages/
│   │   ├── FavoritesPage.jsx       # Saved movies list, search within favorites
│   │   ├── HomePage.jsx            # Spotlight hero, search, filter, and movie grid
│   │   ├── LoginPage.jsx           # Dedicated login route
│   │   ├── MovieDetailsPage.jsx    # Detailed view with backdrop, synopsis, cast, trailer
│   │   └── TrendingPage.jsx        # Trending films (Today / This Week tabs)
│   ├── theme/
│   │   └── theme.js        # Custom MUI theme (colors, typography, overrides)
│   ├── App.jsx             # React Router setup & Context providers
│   ├── index.css           # Global typography, resets, scrollbar styles
│   └── main.jsx            # React root entry point
├── package.json
└── vite.config.js
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `movie-explorer` repository.
4. Framework Preset will automatically detect **Vite**.
5. Set Build Command: `npm run build` and Output Directory: `dist`.
6. Click **Deploy**.

### Deploy to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy movie-explorer**.

---

## 📄 License & Attribution
- Data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Project completed for **Loons Lab**.
