import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import products from "../products";
import ProfileNavbar from "../components/profileNavbar";
import Parse from "parse/dist/parse.min.js";
import HomeBar from "../components/homebar";

var Bids = Parse.Object.extend("Bids");
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

  async function submitBid() {
    // get current user
    const curr = await Parse.User.current();
    if (curr == null) {
      alert("You are not logged in, please sign in");
      return;
    }
    if (curr.get("approved") === false) {
      alert("You can not sell a product till your account has been approved");
      return;
    }
    try {
      let myBid = new Bids();
      myBid.set("buyer", curr.get("username"));
      myBid.set("seller", data.sellername);
      myBid.set("bidamount", bidAmount);
      await myBid.save();
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
