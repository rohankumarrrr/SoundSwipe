import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./HeartAnimation.css";

const HeartAnimation = forwardRef((_, ref) => {
  const [showHeart, setShowHeart] = useState(false);
  const [position, setPosition] = useState({top: 0, left: 0})

  // Expose the triggerAnimation function to the parent using useImperativeHandle
  useImperativeHandle(ref, () => ({
    triggerAnimation(newPosition) {
      setPosition(newPosition);
      console.log(newPosition);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000); // Animation duration
    },
  }));

  return (
    <div>
      {showHeart && (
        <div className="heart-animation" style={{top: `${position.top - 24}px`, left: `${position.left - 24}px`}}>
          <CustomIcon />
        </div>
      )}
    </div>
  );
});

const CustomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="48"
    height="48"
    fill="#fff"
    className="heart-icon-svg"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default HeartAnimation;