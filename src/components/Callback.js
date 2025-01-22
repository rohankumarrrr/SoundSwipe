import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the full hash from the URL
    const hash = window.location.hash;
    console.log(window.location.href);

    // Parse the hash to extract the token
    const hashParams = {};
    hash
      .substring(1) // Remove the initial '#'
      .split("&") // Split into key-value pairs
      .forEach((item) => {
        const [key, value] = item.split("=");
        hashParams[key] = value;
      });

    // Check if the token exists
    if (hashParams.access_token) {
      const token = hashParams.access_token;

      // Save the token (e.g., in localStorage or context)
      localStorage.setItem("spotifyToken", token);

      // Navigate to the app's home screen or another route
      navigate("/SoundSwipe/");
    } else {
      // Handle the error or redirect appropriately
      console.error("No token found in the URL.");
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}

export default Callback;