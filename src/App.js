import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import queryString from "query-string";
import './App.css';
import './assets/fonts/Gotham Medium.otf';
import SwipeableCard from "./components/SwipeableCard";
import SpotifyPlayerComponent from "./components/SpotifyPlayerComponent";
import HeartAnimation from "./components/HeartAnimation";
import Playlist from "./components/Playlist";

const CLIENT_ID = "473b2e893cb64d4aa636f07174c384ea"; // Replace with your Spotify Client ID
const REDIRECT_URI = "http://localhost:3000/callback"; // Replace with your redirect URI
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-top-read",
  "user-library-read",
  "user-library-modify",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state", // Required for reading playback state
  "user-modify-playback-state", // Required for controlling playback
  "streaming" // Required for Web Playback SDK
];

const App = () => {
  const [token, setToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [playlistName, setPlaylistName] = useState("Playlist Name");
  const [isLoading, setIsLoading] = useState(true);
  const heartAnimationRef = useRef();
  const [heartPosition, setHeartPosition] = useState({top: 0, left: 0})
  
  // 1. Extract token from the URL hash after redirect from Spotify
  useEffect(() => {
    const { access_token, error } = queryString.parse(window.location.hash);
    
    if (access_token) {
      setToken(access_token);
      window.location.hash = ""; // Clear hash to avoid repeated parsing
    } else if (error) {
      console.error("Error during authorization:", error);
    }
  }, []);

  // 2. Handle login, redirect to Spotify login page
  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES.join("%20")}`;
    window.location.href = authUrl;
  };

  const fetchPlaylist = async (token) => {
    const limit = 100; // Maximum limit per Spotify API
    let offset = 0;
    let allTracks = [];
    let hasMore = true;
    const playlistId = "5X8lN5fZSrLnXzFtDEUwb9";
  
    try {
      while (hasMore) {
        // Fetch tracks with pagination
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
  
        if (!response.ok) {
          console.error("Failed to fetch playlist tracks:", data);
          throw new Error(data.error.message);
        }
  
        allTracks = [...allTracks, ...data.items]; // Add the current batch of tracks
        // Check if there are more tracks to fetch
        hasMore = data.items.length === limit;
        offset += limit; // Increment offset for the next batch
      }
  
      console.log(`Fetched ${allTracks.length} tracks from the playlist.`);
      return allTracks; // Return the complete list of tracks
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      return [];
    }
  };
  
  function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  // 5. Fetch tracks when token is set
  useEffect(() => {
    const fetchTracks = async () => {
      if (!token) return;

      try {
        const playlistTracks = await fetchPlaylist(token);
        let songs = [];
        for (const song of playlistTracks) {
          songs.push(song.track);
        }
        shuffle(songs);
        if (songs.length > 200) {
          songs = songs.slice(0, 200);
        }
        setTracks(songs);
        setActiveTrack(songs[songs.length - 1]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top 100 tracks:", error);
      }
    };

    fetchTracks();
  }, [token]);

  useEffect(() => {
    if (!isLoading) {
      const coverArtElement = document.querySelector(`.cover-art-${activeTrack.id}`);
      if (coverArtElement) {
        const rect = coverArtElement.getBoundingClientRect();
        setHeartPosition({
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2
        })
      }
    }
  }, [isLoading])

  // 6. Handle Card Swipe
  const handleSwipe = (direction, track) => {
    // Remove the swiped track from the list of tracks
    setTracks((prevTracks) => prevTracks.filter((t) => t.id !== track.id));
    const songs = tracks.filter((t) => t.id !== track.id);
    setActiveTrack(songs[songs.length - 1])
    if (direction === "right") {
      const coverArtElement = document.querySelector(`.card-container`);
      if (coverArtElement) {
        const rect = coverArtElement.getBoundingClientRect();
        heartAnimationRef.current.triggerAnimation({
          top: rect.top + rect.height / 2 - 45,
          left: rect.left + rect.width / 2
        });
      }
      // Add the swiped track to the selected tracks list
      setSelectedTracks((prevSelected) => [...prevSelected, track]);
      saveToLibrary(token, track);
    }
  };

  const saveToLibrary = async (token, track) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/tracks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ids: [track.id],
        }),
      });

      if (!response.ok) {
        console.log(`Track ${track.name} saved to liked songs.`);
      }
    } catch (error) {
      console.error("Error saving track:", error)
    }
  }

  const handleTrackDelete = (trackToDelete) => {
    setSelectedTracks((prevSelected) => 
      prevSelected.filter((track) => track.id !== trackToDelete.id)
    );
  };

  const createPlaylist = async (token, playlistName, tracks) => {
    const getUserId = async (access_token) => {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });
      const res = await response.json();
      return res.id;
    };
    try {
      const user_id = await getUserId(token);
      // Create playlist
      const createPlaylistResponse = await axios.post(
        "https://api.spotify.com/v1/users/" + user_id + "/playlists",
        {
          name: playlistName,
          public: true, // Change to `true` for public playlists
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      const playlistId = createPlaylistResponse.data.id;
      
      // Add tracks to playlist
      const trackURIs = tracks.map(track => `spotify:track:${track.id}`);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: trackURIs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist. Please try again.");
    }
  };

  const [dots, setDots] = useState(""); // State to hold the dots

  useEffect(() => {
    if (tracks.length > 0) return;

    // Set an interval to animate the dots
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return ""; // Reset back to no dots after 3
        } else {
          return prevDots + "."; // Add one dot at a time
        }
      });
    }, 500); // 500ms interval for the dot animation
    // Clean up the interval when the component unmounts or loading is false
    return () => clearInterval(interval);
  }, [tracks.length <= 0]);

  return (
    <div className="App">
      <header className="App-header-div">
        <p className="App-header" style={{ fontWeight: "bold", fontStyle: "normal" }}>Spotify</p>
        <p className="App-header">Discover</p>
      </header>
      {!token ? (
        <div className="login-container">
          <button onClick={handleLogin} className="spotify-login-btn">
            Log in with
            <img
               src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
               alt="Spotify logo"
            />
          </button>
        </div>
      ) : (
        <>
          <HeartAnimation ref={heartAnimationRef} />
          <div className={tracks.length > 0 ? "card-container" : "card-container-none"} style={{}}>
            {tracks.length > 0 ? (
              tracks.map((track, index) => (
                <SwipeableCard
                    key={track.id}
                    track={track}
                    isActiveTrack={index == tracks.length - 1}
                    onSwipe={handleSwipe}
                />
              ))
            ) : isLoading ? (
              <p style={{fontFamily: 'Gotham'}}>Retrieving cool new songs{dots}</p>
            ) : (<p style={{fontFamily: 'Gotham'}}>No more songs. Check back next week!</p>)}
          <div className="mute-btn-container">
          <SpotifyPlayerComponent token={token} track={activeTrack}/>
          </div>
          </div>    
          {!isLoading && <Playlist 
            playlistName={playlistName}
            setPlaylistName={setPlaylistName}
            selectedTracks={selectedTracks}
            createPlaylist={createPlaylist}
            handleTrackDelete={handleTrackDelete}
            token={token}
          />}
        </>
      )}
    </div>
  );

};

export default App;