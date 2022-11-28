import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HomeBar from "../components/homebar";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/sell.css";
import DatePicker from "react-datepicker";
import Parse from "parse/dist/parse.min.js";

var Products = Parse.Object.extend("Products");

function Sell() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;
  console.log("Data: " + data);

  const [product_name, setProductName] = useState("");
  const [product_condition, setProductCondition] = useState("");
  const [product_tag, setProductTag] = useState("");
  const [product_bid, setProductBid] = useState("");
  const [product_des, setProductDes] = useState("");

  // Date Componets and Function so user cant pick a 30 min interval that was before the current time
  const [selectedDate, setSelectedDate] = useState(null);
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };
  // Displays Image and saves base64 of the image for use later
  const [image, setImage] = React.useState("");
  const imageRef = React.useRef(null);

  function useDisplayImage() {
    const [result, setResult] = React.useState("");

    function uploader(e) {
      const imageFile = e.target.files[0];
      console.log(imageFile);
      console.log(image);
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        setResult(e.target.result);
      });
      reader.readAsDataURL(imageFile);
    }
    return { result, uploader };
  }

  const { result, uploader } = useDisplayImage();

  //Parse Function that will add the creatyed producted into Back4App Parse Server
  async function addProduct() {
    var myProduct = new Products();
    const productNameValue = product_name;
    const productCondValue = product_condition;
    const productBidValue = product_bid;
    const productTagValue = product_tag;
    const productDesValue = product_des;
    var base64 = result.split(",base64,").pop();
    const file = new Parse.File(image.name, { base64: base64 });

    // Sets alls Values to be added to Back4app Parse Server
    myProduct.set("product_name", productNameValue);
    myProduct.set("prod_img", file);
    myProduct.set("product_tag", productTagValue);
    myProduct.set("prod_num", +productBidValue);
    myProduct.set("product_des", productDesValue);
    myProduct.set("date_posted", selectedDate);
    myProduct.set("product_condition", productCondValue);
    myProduct.set("product_uploader", data.Object);

    // Saves Function to Back4app Parse Server
    myProduct
      .save()
      .then(function (Products) {
        alert("Product Successfully Added");
        console.log(
          "Products created successful with name: " +
            data.name +
            " and date: " +
            myProduct.get("date_posted")
        );
      })
      .catch(function (error) {
        console.log("Error: " + error.message);
        alert("Error:" + error.message);
      });
  }

  return (
    <div id="screen">
      <HomeBar />
      <div id="display">
        <div id="bodyProducts">
          <article class="reg">
            {" "}
            <h2>Add Product</h2>
            {/* Product Name */}
            <div id="roundedCorner">
              <p id="Label">Enter Product's Name</p>
              <p>
                <input
                  type="text"
                  id="productName"
                  value={product_name}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="Product Name"
                  maxLength="20"
                ></input>
              </p>
            </div>
            {/* Product Min Bid */}
            <div id="roundedCorner">
              <p id="Label">Enter Minimum Bid</p>
              <p>
                <text> $</text>
                <input
                  type="number"
                  id="productMinBid"
                  value={product_bid}
                  onChange={(event) => setProductBid(event.target.value)}
                  placeholder="ex. 20"
                  maxLength="20"
                  min=".01"
                ></input>
              </p>
            </div>
            {/* Product Image */}
            <div id="roundedCorner">
              <p id="Label">Insert Image of Product</p>
              <p>
                <input
                  type="file"
                  id="image_input"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    uploader(e);
                  }}
                ></input>
              </p>
            </div>
            {/* Date Picker*/}
            <div id="roundedCorner">
              <p id="Label">Choose Last Day to Bid for Product</p>
              <p>
                <DatePicker
                  id="productBidDate"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  filterTime={filterPassedTime}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  showDisabledMonthNavigation
                />
              </p>
            </div>
            {/* Product Condition */}
            <div id="roundedCorner">
              <p id="Label">Choose Product's Condition</p>
              <p>
                <input
                  type="text"
                  id="productCondition"
                  value={product_condition}
                  onChange={(event) => setProductCondition(event.target.value)}
                  placeholder="Enter Product's Condition"
                  maxLength="20"
                ></input>
              </p>
            </div>
            {/* Product Tag */}
            <div id="roundedCorner">
              <p id="Label">Choose Product's Tag</p>
              <p>
                <input
                  type="text"
                  id="productTag"
                  value={product_tag}
                  onChange={(event) => setProductTag(event.target.value)}
                  placeholder="ex. Phone, Electronics"
                  maxLength="20"
                ></input>
              </p>
            </div>
            <div id="button-container-div">
              <button
                id="addProductButton"
                onClick={() => addProduct()}
                type="submit"
              >
                Add Product
              </button>
            </div>
          </article>
        </div>
        <div id="bodyProducts">
          <img id="display_image" ref={imageRef} src={result} alt=""></img>
          {/* Product Description */}
          <div id="roundedCorner">
            <p id="Label">Enter Product's Description</p>
            <p>
              <textarea
                type="text"
                id="productDes"
                value={product_des}
                onChange={(event) => setProductDes(event.target.value)}
                placeholder="Enter Product's Description"
                maxLength="400"
              ></textarea>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sell;
