import React, { useState } from "react";
import ProfileNavbar from "../components/profileNavbar";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import Product from "../components/Product";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const location = useLocation();
  const data = location.state;
  if (data === null) {
    data.searchResult = "";
  }
  const [currentUser, setCurrentUser] = useState("");
  const getCurrentUser = async function () {
    const currentUser = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };

  getCurrentUser();

  const navigate = useNavigate();

  const navConfirmResult = (event) => {
    navigate("/searchResult", {
      state: {
        searchResult: data.searchResult,
      },
    });
  };

  return (
    <div>
      {" "}
      {currentUser === null ? <HomeBar /> : <ProfileNavbar />}
      <div>You searched {data.searchResult}</div>
      <button class="m-3 btn btn-primary btn-lg" onClick={navConfirmResult}>
        Click to confirm search
      </button>
    </div>
  );
}
