import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Callback from "./components/Callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SoundSwipe/" element={<Home />} />
        <Route path="/SoundSwipe/#/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;