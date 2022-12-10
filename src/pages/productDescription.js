import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import products from "../products";
import ProfileNavbar from "../components/profileNavbar";
import Parse from "parse/dist/parse.min.js";
import HomeBar from "../components/homebar";
import "../styles/description.css";

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

  function validateUser(curr) {
    if (curr == null) {
      alert("You are not logged in, please sign in");
      return false;
    }
    if (curr.get("approved") === false) {
      alert("You can not sell a product till your account has been approved");
      return false;
    }
    if (curr.get("username") == data.sellername) {
      alert("You can't bid on your own product");
      return false;
    }
    return true;
  }

  function validateBid(bidResult) {
    if (bidResult.length === 0) {
      return true;
    }
    let checkBid = new Parse.Object("Bids");
    checkBid.set("objectId", bidResult[0].id);
    if (checkBid.get("bidamount") >= bidAmount) {
      alert("You must enter a bid higher than your last");
      return false;
    }
    return true;
  }

  async function submitBid() {
    const curr = await Parse.User.current();
    const bidQuery = new Parse.Query("Bids");
    bidQuery
      .contains("buyer", curr.get("username"))
      .contains("seller", data.sellername)
      .contains("productname", data.productname);

    try {
      const bidResult = await bidQuery.find();
      if (!validateUser(curr)) {
        return false;
      }
      if (bidAmount <= 0) {
        alert("You must bid something more than $0");
        return false;
      }
      if (!validateBid(bidResult)) {
        console.log("returned from bad bid");
        return false;
      }
      // make entirely new bid
      if (bidResult.length === 0) {
        let myBid = new Parse.Object("Bids");
        myBid.set("buyer", curr.get("username"));
        myBid.set("seller", data.sellername);
        myBid.set("bidamount", Number(bidAmount));
        myBid.set("productname", data.productname);
        await myBid.save().then(alert("Your bid has been submitted!"));
      }
      // update old bid
      else {
        let myBid = new Parse.Object("Bids");
        myBid.set("objectId", bidResult[0].id);
        myBid.set("bidamount", Number(bidAmount));
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
      message.set("recipient", "Tad");
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

  // if an item is sold, remove the bidding box.
  return (
    <div>
      <ProfileNavbar />
      <div id="backdrop">
        <h1 style={{ color: "purple" }}>Product Description</h1>
        <h3 class="text-center">{data.productname}</h3>
        <img id="image" src={img} />
        <br></br>
        <div>Sold by: {data.sellername}</div>
        <input
          type="number"
          onChange={(event) => setBidAmount(event.target.value)}
        ></input>
        <button class="m-2 btn btn-primary btn-success" onClick={submitBid}>
          Submit Bid
        </button>
        <br></br>
        <button class="m-2 btn btn-primary btn-block" onClick={report}>
          Report
        </button>
      </div>
    </div>
  );
}
