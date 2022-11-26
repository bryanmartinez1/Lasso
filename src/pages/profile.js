import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Profile() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const getCurrentUser = async function () {
      try {
        const currentUser = await Parse.User.current();
        setUserProfile(currentUser);
        return true;
      } catch (error) {
        // Error can be caused by wrong parameters or lack of Internet connection
        alert(`Error! ${error.message}`);
        return false;
      }
    };
    getCurrentUser();
  }, []);

  return (
    <div>
      <h1>Hello, {userProfile.attributes.username}</h1>
      <form>
        <label>
          Username:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
        <br></br>
        <label>
          First Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Profile;
