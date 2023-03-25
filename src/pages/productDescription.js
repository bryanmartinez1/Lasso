import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";
import HomeBar from "../components/homebar";
import "../styles/description.css";

const Messages = Parse.Object.extend("Messages");

export default function ProductDescription() {
  const location = useLocation();
  const data = location.state;
  let date = data.bidEnd.toString();
  let time = date;

  date = date.slice(4, 15);
  time = time.slice(16, 21);

  let hour = time.slice(0, 2);
  console.log(hour);

  if (Number(hour) > 12) {
    let a = Number(hour) - 12;
    time = time.replace(hour, a.toString());
    time += " PM";
  } else {
    time += " AM";
  }

  // pass all relevant info along with state,
  // query on bid request.
  const [bidAmount, setBidAmount] = useState();
  const currDate = new Date();
  const navigate = useNavigate();

  function validateUser(curr) {
    if (curr == null) {
      alert("You are not logged in, please sign in");
      return false;
    }
    if (curr.get("approved") === false) {
      alert("You can not bid until your account has been approved");
      return false;
    }
    if (curr.get("username") === data.seller) {
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
    if (checkBid.get("bidamount") >= Number(bidAmount)) {
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
      .contains("seller", data.seller)
      .contains("productname", data.product);
    const productQuery = new Parse.Query("Products")
      .contains("product_name", data.product)
      .contains("product_uploader", data.seller);
    try {
      const bidResult = await bidQuery.find();
      if (!validateUser(curr)) {
        return false;
      }
      if (bidAmount <= 0) {
        alert("You must bid something more than $0");
        return false;
      }
      if (bidAmount < data.minBid) {
        alert("You must bid higher than the minimum");
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
        myBid.set("seller", data.seller);
        myBid.set("bidamount", Number(bidAmount));
        myBid.set("productname", data.product);
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

  // need to pass sender too.
  function goToMessages(username, t) {
    navigate("/sendmessage", {
      state: { recipient: username, topic: t },
    });
  }
  // Will be Async Function
  function addToCart() {
    alert("Added to Cart");
  }

  return (
    <div className="backGround">
      <HomeBar />
      <div className="topPart">
        <img className="productImg" src={data.imgURL}></img>
        <div className="info">
          <div className="name">{data.product}</div>
          <div className="left">Sold By: {data.seller}</div>

          {currDate < data.bidEnd && (
            <div className="info">
              <div className="left">
                Last Day to Bid: {" " + date + " " + time}
              </div>
              <div className="right">Minimum Bid: ${data.minBid}</div>
              <input
                type="number"
                defaultValue={0}
                onChange={(event) => setBidAmount(event.target.value)}
              ></input>
              <button
                class="m-2 btn btn-primary btn-success"
                onClick={submitBid}
              >
                Submit Bid
              </button>
              <button
                class="m-2 btn btn-primary btn-block"
                onClick={() => addToCart()}
              >
                Add to Cart
              </button>
              <button
                class="m-2 btn btn-primary btn-danger"
                onClick={() =>
                  goToMessages(
                    "Tad",
                    data.product +
                      " sold by " +
                      data.seller +
                      " has been reported"
                  )
                }
              >
                Report
              </button>
            </div>
          )}
          {currDate >= data.bidEnd && "BIDDING ENDED"}
        </div>
      </div>
      <div className="bottomPart">
        <div className="leftBottom">Condition: {" " + data.condition}</div>
        <div className="leftBottom">Description</div>
        <div className="leftBottom">{data.description}</div>
      </div>
    </div>
  );
}

// {
//   <div id="backdrop">
//     <h3 class="text-center">{data.product}</h3>
//     <img id="image" src={data.imgURL} />
//     <br></br>
//     <div>Sold by: {data.seller}</div>
//     <div>Minimum Bid: ${data.minBid}</div>
//     <br></br>
//     <button
//       class="m-2 btn btn-primary btn-block"
//       onClick={() =>
//         goToMessages(
//           "Tad",
//           data.product + " sold by " + data.seller + " has been reported"
//         )
//       }
//     >
//       Report
//     </button>
//   </div>;
// }
