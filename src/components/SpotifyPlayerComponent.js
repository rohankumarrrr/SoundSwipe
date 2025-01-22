import React, { useEffect, useState } from "react";
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
    const loadSpotifySDK = () => {
      return new Promise((resolve, reject) => {
        const existingScript = document.getElementById("spotify-sdk");
        if (existingScript) {
          resolve();
          return;
        }

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
        play: false, // Start paused initially
      });

      try {
        const response = await fetch(url, { method: "PUT", headers, body });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Transfer Playback Error:", errorData);
        } else {
          // console.log("Playback transferred to device:", id);
        }
      } catch (error) {
        console.error("Network or Fetch Error:", error);
      }
    };

    const initializePlayer = async () => {
      await loadSpotifySDK();

      window.onSpotifyWebPlaybackSDKReady = () => {
        const playerInstance = new window.Spotify.Player({
          name: "Spotify Web Player",
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        playerInstance.addListener("ready", ({ device_id }) => {
          // console.log("Player Ready with Device ID:", device_id);
          setDeviceId(device_id);
          transferPlayback(device_id); // Ensure playback transfer
          setIsPlayerReady(true); // Set player as ready
        });

        playerInstance.addListener("player_state_changed", (state) => {
          if (!state) return;
          // console.log("Player State Changed:", state);
        });

        playerInstance.connect();
        setPlayer(playerInstance);
      };
    };

    initializePlayer();

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const playTrack = async (uri) => {
    if (!uri) return;

    const url = "https://api.spotify.com/v1/me/player/play";
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
        }, 750); // 1-second delay, you can adjust this as needed
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
