import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import products from "../products";
import Parse from "parse/dist/parse.min.js";

var Bids = Parse.Object.extend("Bids");
const Messages = Parse.Object.extend("Messages");

export default function ProductDescription() {
  const location = useLocation();
  const data = location.state;
  console.log("Product name: ", data.productname);
  console.log("Product seller: ", data.sellername);

  // pass all relevant info along with state,
  // query on bid request.
  const [bidAmount, setBidAmount] = useState();

  async function submitBid() {
    // get current user
    const curr = await Parse.User.current();
    const productQuery = new Parse.Query("Products");
    productQuery
      .contains("product_uploader", data.sellername)
      .contains("product_name", data.productname);
    try {
      const productResult = productQuery.first();
      let myBid = new Bids();
      myBid.set("buyer", curr.get("username"));
      myBid.set("amount", bidAmount);
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
      <h1>Product Description</h1>
      <h2>{data.productname}</h2>
      <textarea>IMG</textarea>
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
