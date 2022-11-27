// import logo from "./logo.svg";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Sell from "./pages/sell";

// import UserRegistration from "./auth/UserRegistration";
import { App_Id, JavaScript_key, Host_Server } from "./KEYS.js";
import Parse from "parse/dist/parse.min.js";

Parse.initialize(App_Id, JavaScript_key); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = Host_Server;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </Router>
  );
}

export default App;
