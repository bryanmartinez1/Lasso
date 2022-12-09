import React, { useState } from "react";
import ProfileNavbar from "../components/profileNavbar";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import { useLocation } from "react-router-dom";

export default function SearchResult() {
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
  return (
    <div>
      {" "}
      {currentUser === null ? <HomeBar /> : <ProfileNavbar />}
      <div>You searched {data.searchResult}</div>
    </div>
  );
}
