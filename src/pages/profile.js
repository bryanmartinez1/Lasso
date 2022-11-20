import React from "react";
import { useLocation } from "react-router-dom";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Profile() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;
  console.log(data);
  return (
    <div>
      <h1>Hello, {data.name}</h1>
    </div>
  );
}

export default Profile;
