import { React, useState, useEffect } from "react";
import Parse from "parse/dist/parse.min.js";
import Homebar from "../components/homebar";
import "../styles/profile.css";
import { useLocation, useNavigate } from "react-router-dom";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  //the data here will be an object since an object was
  const data = location.state;
  // queryResults and which page to show
  const [queryResults, setQueryResults] = useState();
  const [displayPersonal, setDisplayPersonal] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayOrders, setDisplayOrders] = useState(false);
  const [displayMessages, setDisplayMessgaes] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(false);
  const [balanceChange, setBalanceChange] = useState();
  const [displayBids, setDisplayBids] = useState(false);
  const [displaySales, setDisplaySales] = useState(false);
  // user data info for update profile
  const [currentUser, setCurrentUser] = useState(null);
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [address, setAddress] = useState();
  const [phonenumber, setPhoneNumber] = useState();
  const [creditcardnumber, setCreditCardNumber] = useState();
  const [password, setPassword] = useState();
  const [rating, setRating] = useState();

  // On submitting rating check if average is below 3 with less than 2.
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
        setDisplayBalance(false);
        setDisplayBids(false);
        setDisplaySales(false);
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
      setDisplayBalance(false);
      setDisplayBids(false);
      setDisplaySales(false);
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
          <td>
            {!product.get("sold") && (
              <button
                class="btn btn-secondary"
                onClick={() => {
                  productBidsOn(queryResults[index]);
                }}
              >
                View Bids
              </button>
            )}
            {product.get("sold") && "SOLD"}
          </td>
        </tr>
      );
    });
  }

  async function productBidsOn(product) {
    console.log(product.attributes.product_name);
    const curr = await Parse.User.current();
    const bidQuery = new Parse.Query("Bids");
    bidQuery
      .contains("seller", curr.get("username"))
      .contains("productname", product.attributes.product_name)
      .descending("bidamount");
    try {
      const bidResults = await bidQuery.find();
      setQueryResults(bidResults);
      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayMessgaes(false);
      setDisplayBalance(false);
      setDisplaySales(false);
      setDisplayOrders(false);
      setDisplayBids(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  // if index != 0, then they should be sent to the sendMessage page.
  function getBidRow() {
    return queryResults.map((bid, index) => {
      return (
        <tr key={index}>
          <td>{bid.get("productname")}</td>
          <td>{bid.get("buyer")}</td>
          <td>${bid.get("bidamount")}</td>
          <td>
            <button
              class="btn btn-success"
              onClick={() =>
                acceptBid(bid, index).then(
                  goToMessages(index, "Tad", "Chose non-highest bid")
                )
              }
            >
              Accept
            </button>
          </td>
        </tr>
      );
    });
  }

  function goToMessages(index, username, t) {
    if (index !== 0) {
      navigate("/sendmessage", {
        state: { recipient: username, topic: t },
      });
    }
  }

  async function acceptBid(bid, index) {
    const buyerBalanceQuery = new Parse.Query("UserBalance").contains(
      "username",
      bid.get("buyer")
    );
    const sellerBalanceQuery = new Parse.Query("UserBalance").contains(
      "username",
      bid.get("seller")
    );
    const productQuery = new Parse.Query("Products")
      .contains("product_uploader", bid.get("seller"))
      .contains("product_name", bid.get("productname"));
    // edit the buyer balance and then the seller balance
    // mark item sold
    // alert the user their sale went through
    // if the bid was not the highest, i.e. index != 0,
    // navigate to sendMessage to send message to Admin
    try {
      const buyerBalanceResult = await buyerBalanceQuery.first();
      const sellerBalanceResult = await sellerBalanceQuery.first();
      const productResult = await productQuery.first();

      let bBalance = new Parse.Object("UserBalance");
      const bAmount = buyerBalanceResult.get("amount");
      bBalance.set("objectId", buyerBalanceResult.id);
      bBalance.set("amount", bAmount - Number(bid.get("bidamount")));

      let sBalance = new Parse.Object("UserBalance");
      const sAmount = sellerBalanceResult.get("amount");
      sBalance.set("objectId", sellerBalanceResult.id);
      sBalance.set(
        "amount",
        sBalance.get("amount") + Number(bid.get("bidamount"))
      );

      let p = new Parse.Object("Products");
      p.set("objectId", productResult.id);
      p.set("sold", true);

      // generate a new transaction
      let newTransac = new Parse.Object("Orders");
      newTransac.set("product", bid.get("productname"));
      newTransac.set("buyer", bid.get("buyer"));
      newTransac.set("seller", bid.get("seller"));
      newTransac.set("amount", bid.get("bidamount"));

      // save all the stuff
      await bBalance.save();
      await sBalance.save();
      await p.save();
      await newTransac.save();

      alert("Your purchase was successful");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function userTransactionsOn() {
    const curr = await Parse.User.current();
    const orderQuery = new Parse.Query("Orders");
    orderQuery.contains("buyer", curr.get("username"));
    try {
      const orderResults = await orderQuery.find();
      setQueryResults(orderResults);
      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayMessgaes(false);
      setDisplayBalance(false);
      setDisplayBids(false);
      setDisplaySales(false);
      setDisplayOrders(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function userSalesOn() {
    const curr = await Parse.User.current();
    const orderQuery = new Parse.Query("Orders");
    orderQuery.contains("seller", curr.get("username"));
    try {
      const orderResults = await orderQuery.find();
      setQueryResults(orderResults);
      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayMessgaes(false);
      setDisplayBalance(false);
      setDisplayBids(false);
      setDisplayOrders(false);
      setDisplaySales(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function addRating(order) {
    const curr = await Parse.User.current();
    // add rating to sellers rating
    const ratingQuery = new Parse.Query("Ratings");
    ratingQuery.contains("username", order.get("seller"));
    try {
      const ratingResults = await ratingQuery.first();
      let ratingsChange = ratingResults.get("ratings");
      ratingsChange.push(Number(rating));
      const oldNumRatings = ratingResults.get("numratings");
      let ratingUpdate = new Parse.Object("Ratings");
      ratingUpdate.set("objectId", ratingResults.id);
      ratingUpdate.set("ratings", ratingsChange);
      ratingUpdate.set("numratings", oldNumRatings + 1);
      const ratingsum = ratingsChange.reduce(function (prev, curr) {
        return prev + curr;
      });
      ratingUpdate.set("averagerating", ratingsum / (oldNumRatings + 1));
      await ratingUpdate.save();

      let orderUpdate = new Parse.Object("Orders");
      orderUpdate.set("objectId", order.id);
      orderUpdate.set("rated", true);
      orderUpdate.set("rating", Number(rating));
      await orderUpdate.save();

      if (rating < 2 || rating > 4) {
        const flags = curr.get("flags");
        console.log(flags);
        curr.set("flags", flags + 1);
        if (flags === 2) {
          curr.set("approved", false);
          alert(
            "You have submitted 3 1 or 5 star ratings, and must speak with an admin to unlock your account again"
          );
          const message = new Parse.Object("Messages");
          message.set("recipient", "Tad");
          message.set("sender", curr.get("username"));
          message.set(
            "content",
            "User has submitted 3 1 or 5 star ratings, please check their account."
          );
          message.set(
            "topicline",
            curr.get("username") + " has been flagged as suspicious"
          );
          message.save();
        }
        await curr.save();
      }

      alert("Rating Submitted");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getSaleRow() {
    return queryResults.map((order, index) => {
      return (
        <tr key={index}>
          <td>{order.get("buyer")}</td>
          <td>{order.get("product")}</td>
          <td>${order.get("amount")}</td>
        </tr>
      );
    });
  }

  function getOrderRow() {
    return queryResults.map((order, index) => {
      return (
        <tr key={index}>
          <td>{order.get("product")}</td>
          <td>{order.get("amount")}</td>
          <td>
            {!order.get("rated") && (
              <div>
                <input
                  type="number"
                  min="1"
                  max="5"
                  onChange={(event) => setRating(event.target.value)}
                ></input>
                <button
                  class="m-2 btn btn-primary"
                  onClick={() => addRating(queryResults[index])}
                >
                  Submit Rating
                </button>
              </div>
            )}
            {order.get("rated") && order.get("rating")}
          </td>
          <td>
            <button
              class="m-2 btn btn-secondary btn-outline-warning"
              onClick={() =>
                goToMessages(
                  1,
                  "Tad",
                  "Complaint: " +
                    order.get("product") +
                    " Purchased from: " +
                    order.get("seller")
                )
              }
            >
              File Complaint
            </button>
          </td>
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
      setDisplayBalance(false);
      setDisplayBids(false);
      setDisplaySales(false);
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

  async function balanceOn() {
    const curr = await Parse.User.current();
    const balanceQuery = new Parse.Query("UserBalance");
    balanceQuery.contains("username", curr.get("username"));
    try {
      const balanceResult = await balanceQuery.first();
      setQueryResults(balanceResult);

      setDisplayProducts(false);
      setDisplayPersonal(false);
      setDisplayOrders(false);
      setDisplayMessgaes(false);
      setDisplayBids(false);
      setDisplayBalance(true);
      setCurrentUser(curr);
      console.log(queryResults);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function deposit() {
    try {
      const currBalance = queryResults.get("amount");
      let cBalance = new Parse.Object("UserBalance");
      cBalance.set("objectId", queryResults.id);
      cBalance.set("amount", currBalance + Number(balanceChange));
      await cBalance.save();
      alert("Your balance was changed");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function withdraw() {
    try {
      const currBalance = queryResults.get("amount");
      if (Number(balanceChange) > currBalance) {
        alert("You cannot withdraw more than your current balance");
        return true;
      }
      let cBalance = new Parse.Object("UserBalance");
      cBalance.set("objectId", queryResults.id);
      cBalance.set("amount", currBalance - Number(balanceChange));
      await cBalance.save();
      alert("Your balance was changed");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  return (
    <section>
      <Homebar />
      <div id="row_div">
        <div id="column_div">
          <div className="side_bar">
            <button id="side_nav_bt" onClick={personalInfoOn}>
              Personal Info
            </button>
            <button id="side_nav_bt" onClick={balanceOn}>
              Balance
            </button>
            <button id="side_nav_bt" onClick={userItemsOn}>
              Your Products
            </button>
            <button id="side_nav_bt" onClick={userTransactionsOn}>
              Your Purchases
            </button>
            <button id="side_nav_bt" onClick={userSalesOn}>
              Your Sales
            </button>
            <button id="side_nav_bt" onClick={userMessagesOn}>
              Messages
            </button>
          </div>
        </div>

        <div id="box1">
          <center>
            <form>
              {displayPersonal && (
                <div id="box2">
                  <div id="head">
                    <h1>Update Personal Information</h1>{" "}
                  </div>
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
                    onChange={(event) =>
                      setCreditCardNumber(event.target.value)
                    }
                  ></input>
                  <br></br>
                  <label htmlFor="password">Enter new password here:</label>
                  <input
                    type="text"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                  ></input>
                  <br></br>
                  <button
                    className="btn btn-primary btn-lg btn-block"
                    onClick={updateProfile}
                  >
                    Submit Changes
                  </button>
                </div>
              )}
            </form>
          </center>

          <center>
            <form>
              {displayBalance && (
                <div>
                  <h1>Balance</h1>
                  <h2 style={{ color: "red" }}>
                    ${queryResults.get("amount").toFixed(2)}
                  </h2>
                  <h3>
                    Enter the amount you'd like to deposit or withdraw here:
                  </h3>
                  <input
                    type="number"
                    onChange={(event) => setBalanceChange(event.target.value)}
                  ></input>
                  <button
                    class="m-2 btn btn-primary btn-block btn-success"
                    onClick={deposit}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={withdraw}
                    style={{ marginLeft: "25px" }}
                    className="btn btn-secondary"
                  >
                    Withdraw
                  </button>
                </div>
              )}
            </form>
          </center>

          {displayProducts && (
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Product Name
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Uploader Name
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Approved?
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Bids
                  </th>
                </tr>
              </thead>
              <tbody>{getProductRow()}</tbody>
            </table>
          )}

          {displayBids && (
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Bidder
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Bid Amount
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Accept Bid?
                  </th>
                </tr>
              </thead>
              <tbody>{getBidRow()}</tbody>
            </table>
          )}

          {displayMessages && (
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Sender
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Topic
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Content
                  </th>
                </tr>
              </thead>
              <tbody id="msg">{getMessageRow()}</tbody>
            </table>
          )}

          {displayOrders && (
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Rating
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Complaint
                  </th>
                </tr>
              </thead>
              <tbody>{getOrderRow()}</tbody>
            </table>
          )}

          {displaySales && (
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Buyer
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      color: "black",
                      border: "solid",
                      padding: "10px",
                      fontFamily: "Arial",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>{getSaleRow()}</tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
