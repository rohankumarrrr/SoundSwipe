import React, { useEffect, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";
import './SpotifyPlayerComponent.css';
import SpeakerOffIcon from '../assets/images/speaker-off.png';
import SpeakerOnIcon from '../assets/images/speaker-on.png';

const SpotifyPlayerComponent = ({ token, track }) => {
  const trackUri = track?.uri;
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Track if the player is ready


  useEffect(() => {

    if (isMobile || isTablet) {
      alert("Playback is not supported on mobile browsers. Please use the app on web.");
    }

    const loadSpotifySDK = () => {
      return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        const existingScript = document.getElementById("spotify-sdk");
        if (existingScript) {
          resolve();
          return;
        }
  
        // Define onSpotifyWebPlaybackSDKReady globally BEFORE adding the script
        if (!window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new window.Spotify.Player({
              name: "Spotify Web Player",
              getOAuthToken: (cb) => cb(token),
              volume: 0.5,
            });
  
            // Set up event listeners for the player
            playerInstance.addListener("ready", ({ device_id }) => {
              setDeviceId(device_id);
              transferPlayback(device_id);
              setIsPlayerReady(true);
            });
  
            playerInstance.addListener("initialization_error", ({ message }) => {
              console.error("Initialization Error:", message);
            });
  
            playerInstance.addListener("authentication_error", ({ message }) => {
              console.error("Authentication Error:", message);
            });
  
            playerInstance.connect();
            setPlayer(playerInstance);
          };
        }
  
        // Load the Spotify SDK script
        const script = document.createElement("script");
        script.id = "spotify-sdk";
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
  
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Spotify SDK"));
  
        document.body.appendChild(script);
      });
    };
  
    const transferPlayback = async (id) => {
      const url = "https://api.spotify.com/v1/me/player";
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({
        device_ids: [id],
        play: false,
      });
  
      try {
        const response = await fetch(url, { method: "PUT", headers, body });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Transfer Playback Error:", errorData);
        }
      } catch (error) {
        console.error("Network or Fetch Error:", error);
      }
    };
  
    // Initialize the SDK and Player
    loadSpotifySDK();
  
    return () => {
      if (player) {
        player.disconnect();
      }
      delete window.onSpotifyWebPlaybackSDKReady; // Clean up the global function
    };
  }, [token]);

  const playTrack = async (uri) => {
    if (!uri) return;

    const url = "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ uris: [uri], position_ms: 20000 });

    try {
      const response = await fetch(url, { method: "PUT", headers, body });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
      } else {
        // console.log("Track played successfully:", uri);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
    }
  };

  const pausePlayback = async () => {
    const url = "https://api.spotify.com/v1/me/player/pause";
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, { method: "PUT", headers });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Pause Playback Error:", errorData);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
    }
  };

  // Delay playback slightly to ensure device is ready and playback can be transferred correctly
  useEffect(() => {

    if (isPlayerReady && deviceId) {
      if (trackUri) {
        setTimeout(() => {
          playTrack(trackUri); // Attempt playback after a short delay
        }, 500); // 0.5-second delay, you can adjust this as needed
      } else {
        pausePlayback();
      }
    }
  }, [deviceId, trackUri, isPlayerReady]);

  const toggleMute = () => {
    if (player) {
      player.setVolume(isMuted ? 0.5 : 0); // Unmute to 50% or mute to 0%
      setIsMuted(!isMuted);
    }
  };

  return (
    <div>
      {/* Mute Button with Image */}
      {trackUri && <img
        src={isMuted ? SpeakerOffIcon : SpeakerOnIcon}
        alt={isMuted ? "Unmute" : "Mute"}
        onClick={toggleMute}
        className="mute-img"
        style={{
          cursor: "pointer",
          width: "50px",
          height: "50px",
        }}
      />}
    </div>
  );
};

export default SpotifyPlayerComponent;
