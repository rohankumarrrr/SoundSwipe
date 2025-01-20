import React, { useState } from "react";
import "./SwipeableCard.css";

const SwipeableCard = ({ track, onSwipe, isActiveTrack }) => {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (e) => {
    
    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartPosition({ x: startX, y: startY });
    setIsDragging(true);

  };

  const handleMove = (e) => {
    if (!isDragging) return;

    const moveX = e.touches ? e.touches[0].clientX : e.clientX;
    const moveY = e.touches ? e.touches[0].clientY : e.clientY;

    setCurrentPosition({
      x: moveX - startPosition.x,
      y: moveY - startPosition.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);

    // Determine swipe direction
    if (currentPosition.x > 100) {
      onSwipe("right", track); // Swiped right
    } else if (currentPosition.x < -100) {
      onSwipe("left", track); // Swiped left
    }

    // Reset position for the next card
    setCurrentPosition({ x: 0, y: 0 });
  };

  const trackName = track.name;
  const artistName = track.artists.map((artist)=> artist.name).join(", ");

  return (
    <div
      className="swipeable-card"
      style={{
        transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${currentPosition.x / 20}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
        boxShadow: isActiveTrack ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "none"
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd} // Handle case when mouse leaves card
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <img
        draggable="false"
        src={track.album.images[0]?.url}
        alt={`${track.name} cover`}
        className={`track-card-image cover-art-${track.id}`}
      />
      <div className="track-card-details">
        <h3>{trackName.length < 25 ? trackName : trackName.substring(0, 25) + "..."}</h3>
        <p>{artistName.length < 30 ? artistName : artistName.substring(0, 30) + "..."}</p>
      </div>
    </div>
  );
};

export default SwipeableCard;