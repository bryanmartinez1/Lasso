import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ProfileNavbar from "../components/profileNavbar";
import { Button, Divider } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Profile() {
  const [queryResults, setQueryResults] = useState();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [creditcardnumber, setCreditCardNumber] = useState("");

  const updateProfile = async function () {
    try {
      const currentUser = await Parse.User.current();
      currentUser.set("firstname", firstname);
      currentUser.set("lastname", lastname);
      if (password !== "") {
        currentUser.set("password", password);
      }
      currentUser.set("address", address);
      currentUser.set("phonenumber", phonenumber);
      currentUser.set("creditcardnumber", creditcardnumber);
      await currentUser.save();
      alert("Success, your Profile was updated!");
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };

  async function personalInfoOn() {}

  async function userItemsOn() {}

  async function userTransactionsOn() {}

  return (
    <section>
      <ProfileNavbar />
      <div id="row_div">
        <div id="column_div">
          <div id="side_bar">
            <button id="side_nav_bt" onClick={personalInfoOn}>
              Personal Info
            </button>
            <button id="side_nav_bt" onClick={userItemsOn}>
              Your Products
            </button>
            <button id="side_nav_bt" onClick={userTransactionsOn}>
              Your Orders
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
