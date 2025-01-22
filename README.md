# SoundSwipe 🎵  

SoundSwipe is an interactive music discovery app that helps users explore new tracks from the latest weekly releases across all genres. Swipe right to save songs directly to your Spotify library or swipe left to skip. Build custom playlists from your favorite right-swiped tracks and expand your music library like never before.  

## Features  
- **Weekly Refresh**: Enjoy a fresh playlist of newly released songs every week.  
- **Interactive Swiping**: Swipe right to save songs or left to skip them.  
- **Seamless Spotify Integration**: Automatically add right-swiped tracks to your Spotify saved songs.  
- **Custom Playlists**: Create personalized playlists from your liked tracks with ease.  

## Demo  
![Log-In Screen](https://github.com/rohankumarrrr/SoundSwipe/blob/main/public/screenshots/login.png)
![Swipeable Card](https://github.com/rohankumarrrr/SoundSwipe/blob/main/public/screenshots/swipeable-card.png)
![Playlist](https://github.com/rohankumarrrr/SoundSwipe/blob/main/public/screenshots/playlist.png)

## Tech Stack  
- **Application**: React.js with modern hooks for an interactive UI.  
- **Spotify Web API**: For user authentication, track management, and playback control.  
- **OAuth 2.0**: Securely authenticate users with Spotify.  

## Getting Started  

### Prerequisites  
- React.js
- Spotify Developer Account with a registered application  

### Setup  

1. **Clone the repository**  
   ```bash  
   git clone https://github.com/yourusername/spotify-discover.git  
   cd spotify-discover
   ```
2. **Install dependencies**
  ```bash
  npm install
  ```
3. **Start the development server**
  ```bash
  npm start
  ```

## How It Works

1. **Authenticate with Spotify:**
    Log in using your Spotify account to connect the app. Must be a premium account.
2. **Discover New Tracks:**
    A playlist of newly released songs is refreshed weekly. The playlist I use to pull songs from can be found here: https://open.spotify.com/playlist/5X8lN5fZSrLnXzFtDEUwb9?si=01210fe8f8f34f71
3. **Swipe Right or Left:**
    * Swipe **right** to save a song to your Spotify library.
    * Swipe **left** to skip a track.
4. **Build Playlists:**
    Create and customize playlists with tracks you've swiped right on.

## Folder Structure

spotify-discover/  
│  
├── public/                # Static assets  
├── src/                   # Source code  
│   ├── components/        # React components (e.g., SwipeCard, Playlist, SpotifyPlayerComponent, HeartAnimation)  
│   └── App.js             # Main app component  
└── README.md              # Project documentation  

## Contributing

I welcome contributions! To get started:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## License

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md).

## Contact

Have questions or suggestions? Feel free to reach out!

* **Email**: rohankumar0513@gmail.com
* **Github**: @rohankumarrrr
