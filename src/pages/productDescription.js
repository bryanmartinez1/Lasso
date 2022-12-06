import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import products from "../products";
import ProfileNavbar from "../components/profileNavbar";
import Parse from "parse/dist/parse.min.js";
import HomeBar from "../components/homebar";

const Messages = Parse.Object.extend("Messages");

export default function ProductDescription() {
  const location = useLocation();
  const data = location.state;
  console.log("Product name: ", data.productname);
  console.log("Product seller: ", data.sellername);
  console.log("Product Img URL: " + data.imgURL);
  const img = data.imgURL;

  // pass all relevant info along with state,
  // query on bid request.
  const [bidAmount, setBidAmount] = useState();

  async function validateUser(curr) {
    if (curr == null) {
      alert("You are not logged in, please sign in");
      return false;
    }
    if (curr.get("approved") === false) {
      alert("You can not sell a product till your account has been approved");
      return false;
    }
    return true;
  }
  async function submitBid() {
    // to add: check if bid is higher than current highest bid.
    // and check if a user is trying to input a bid higher than their last
    // they should only be allowed to do this.

    // check if logged in or not approved
    const curr = await Parse.User.current();
    if (!validateUser(curr)) {
      return;
    }
    // check if the current user has bid on this item, if so, just change
    // that bid. Otherwise make a new bid.
    const bidQuery = new Parse.Query("Bids");
    bidQuery
      .contains("buyer", curr.get("username"))
      .contains("seller", data.sellername)
      .contains("productname", data.productname);

    try {
      const bidResult = await bidQuery.find();
      // make entirely new bid
      if (bidResult.length === 0) {
        let myBid = new Parse.Object("Bids");
        myBid.set("buyer", curr.get("username"));
        myBid.set("seller", data.sellername);
        myBid.set("bidamount", bidAmount);
        myBid.set("productname", data.productname);
        await myBid.save().then(alert("Your bid has been submitted!"));
      }
      // update old bid
      else {
        let myBid = new Parse.Object("Bids");
        myBid.set("objectId", bidResult[0].id);
        myBid.set("bidamount", bidAmount);
        await myBid.save().then(alert("Your bid has been updated!"));
      }
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function report() {
    const text =
      "The item: " +
      data.productname +
      " posted by " +
      data.sellername +
      " has been reported. Please investigate ASAP.";
    const topic = "Report";
    try {
      const message = new Messages();
      message.set("recipient", "TestUser");
      message.set("sender", "Anonymous");
      message.set("content", text);
      message.set("topicline", topic);
      message.save();
      alert("Report was sent successfully, please do not report again.");
      return true;
    } catch (error) {
      alert("Error:" + error.message);
    }
  }

  return (
    <div>
      <ProfileNavbar />
      <h1>Product Description</h1>
      <h2>{data.productname}</h2>
      <img src={img} />
      <br></br>
      <div>Sold by: {data.sellername}</div>
      <input
        type="number"
        onChange={(event) => setBidAmount(event.target.value)}
      ></input>
      <button onClick={submitBid}>Submit Bid</button>
      <br></br>
      <button onClick={report}>Report</button>
    </div>
  );
}
