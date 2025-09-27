import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Chats from "./pages/Chats.jsx";
// import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chats" element={<Chats />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
