import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Sell from "./pages/sell";
import Admin from "./pages/admin";
import SendMessage from "./pages/sendMessage";
import Cart from "./pages/cart";
import SearchResult from "./pages/searchResult";
import ProductDescription from "./pages/productDescription";
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/sendmessage" element={<SendMessage />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/pages/productDescription"
          element={<ProductDescription />}
        />
        <Route path="/searchResult" element={<SearchResult />} />
      </Routes>
    </Router>
  );
}

export default App;
