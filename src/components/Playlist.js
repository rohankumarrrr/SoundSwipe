import React from "react";
import EditIcon from "../assets/images/edit-icon.png"
import "./Playlist.css";

const Playlist = ({
  playlistName,
  setPlaylistName,
  selectedTracks,
  handleTrackDelete,
  createPlaylist,
  token,
}) => {
  return (
    <div className="selected-tracks-container">
      <div className="playlist-header-container">
        <div className="edit-playlist-name-container">
          <input
            type="text"
            value={playlistName}
            onChange={(event) => setPlaylistName(event.target.value)}
            className="playlist-name-input"
            placeholder="Playlist Name"
          />
          <img
              src={EditIcon}
              alt="Edit Icon"
              className="edit-icon"
          />
        </div>

        <button
          onClick={() => createPlaylist(token, playlistName, selectedTracks)}
          className="create-playlist-btn"
        >
          Create Playlist
        </button>
      </div>
      <div className="track-list">
        <ul>
          {selectedTracks.map((track) => (
            <li key={track.id} className="track-item">
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="track-cover"
              />
              <div className="track-details">
                <p className="track-name">{track.name}</p>
                <p className="track-artist">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
              <button
                onClick={() => handleTrackDelete(track)}
                className="delete-track-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width="30"
                  height="30"
                  fill="none"
                  className="delete-track-btn-svg"
                >
                  <circle cx="50" cy="50" r="45" stroke="#b3b3b3" stroke-width="6" fill="none" />
                  <line x1="30" y1="50" x2="70" y2="50" stroke="#b3b3b3" stroke-width="6" stroke-linecap="round" fill="none" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Playlist;