import { React, useState, useEffect } from "react";
import Parse from "parse/dist/parse.min.js";
import ProfileNavbar from "../components/profileNavbar";
import "../styles/profile.css";
import { useLocation } from "react-router-dom";

function Profile() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;

  // queryResults and which page to show
  const [queryResults, setQueryResults] = useState();
  const [displayPersonal, setDisplayPersonal] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayOrders, setDisplayOrders] = useState(false);
  const [displayMessages, setDisplayMessgaes] = useState(false);
  // user data info for update profile
  const [currentUser, setCurrentUser] = useState();
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [address, setAddress] = useState();
  const [phonenumber, setPhoneNumber] = useState();
  const [creditcardnumber, setCreditCardNumber] = useState();
  const [password, setPassword] = useState();

  // to add: View bids on their items, i.e. highest bid only, then when the time is over
  // put in a list of all the bids they can see, if they select a non-highest bid, they must
  // provide a reason to the admins. In any case, also add balance changer, and upon sale
  // they must click agree, then they must wait for the buyer to select pay on their end.
  // on the buyer end their balance will decrease in their account
  // then they will receive a message where they can click accept, and on their end they
  // will raise their balance by the accepted paid amount, and also they will receive shipping details.
  // Also have to add a delete message function. And upon item sold delete all bids for the item.
  async function updateProfile() {
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
  }

  async function personalInfoOn() {
    const curr = await Parse.User.current();
    try {
      setCurrentUser(curr);
      // put this here because for some reason this will try to use get on null
      // all it does is require a double click to show user info.
      if (currentUser != null) {
        setFirstName(currentUser.get("firstname"));
        setLastName(currentUser.get("lastname"));
        setAddress(currentUser.get("address"));
        setPhoneNumber(currentUser.get("phonenumber"));
        setCreditCardNumber(currentUser.get("creditcardnumber"));
        setDisplayProducts(false);
        setDisplayOrders(false);
        setDisplayMessgaes(false);
        setDisplayPersonal(true);
      }
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function userItemsOn() {
    const curr = await Parse.User.current();
    const productQuery = new Parse.Query("Products");
    productQuery.contains("product_uploader", curr.get("username"));
    try {
      const productResults = await productQuery.find();
      setQueryResults(productResults);
      setDisplayOrders(false);
      setDisplayPersonal(false);
      setDisplayMessgaes(false);
      setDisplayProducts(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getProductRow() {
    return queryResults.map((product, index) => {
      return (
        <tr key={index}>
          <td>{product.get("product_name")}</td>
          <td>{product.get("product_uploader")}</td>
          <td>{product.get("approved") ? "Approved" : "Unapproved"}</td>
        </tr>
      );
    });
  }

  async function userTransactionsOn() {
    const curr = await Parse.User.current();
    const orderQuery = new Parse.Query("Messages");
    orderQuery.contains("buyer", curr.get("username"));
    try {
      const orderResults = await orderQuery.find();
      setQueryResults(orderResults);
      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayMessgaes(false);
      setDisplayOrders(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getOrderRow() {
    console.log(queryResults);
    return queryResults.map((order, index) => {
      return (
        <tr key={index}>
          <td>{order.get("product")}</td>
          <td>{order.get("amount")}</td>
          <td>{order.get("rating")}</td>
        </tr>
      );
    });
  }

  async function userMessagesOn() {
    const curr = await Parse.User.current();
    const messageQuery = new Parse.Query("Messages");
    messageQuery.contains("recipient", curr.get("username"));
    try {
      const messageResults = await messageQuery.find();
      setQueryResults(messageResults);
      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayOrders(false);
      setDisplayMessgaes(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getMessageRow() {
    return queryResults.map((message, index) => {
      return (
        <tr key={index}>
          <td>{message.get("sender")}</td>
          <td>{message.get("topicline")}</td>
          <td>
            <textarea readOnly value={message.get("content")}></textarea>
          </td>
        </tr>
      );
    });
  }

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
            <button id="side_nav_bt" onClick={userMessagesOn}>
              Messages
            </button>
          </div>
        </div>
        <div>
          {displayPersonal && (
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                defaultValue={firstname}
                onChange={(event) => setFirstName(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                defaultValue={lastname}
                onChange={(event) => setLastName(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                defaultValue={address}
                onChange={(event) => setAddress(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="phonenumber">Phone Number:</label>
              <input
                type="text"
                id="phonenumber"
                defaultValue={phonenumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="creditcard">Credit Card:</label>
              <input
                type="text"
                id="creditcard"
                defaultValue={creditcardnumber}
                onChange={(event) => setCreditCardNumber(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="password">Enter new password here:</label>
              <input
                type="text"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
              ></input>
              <br></br>
              <button onClick={updateProfile}>Submit Changes</button>
            </div>
          )}

          {displayProducts && (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Uploader Name</th>
                  <th>Approved?</th>
                </tr>
              </thead>
              <tbody>{getProductRow()}</tbody>
            </table>
          )}

          {displayMessages && (
            <table className="table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Topic</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>{getMessageRow()}</tbody>
            </table>
          )}

          {displayOrders && (
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>{getOrderRow()}</tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
