import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/sell.css";
import DatePicker from "react-datepicker";
import Parse from "parse/dist/parse.min.js";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Homebar from "../components/homebar";

var Products = Parse.Object.extend("Products");

function Sell() {
  const [product_name, setProductName] = useState("");
  const [product_condition, setProductCondition] = useState("");
  const [product_tag, setProductTag] = useState("");
  const [product_bid, setProductBid] = useState("");
  const [product_des, setProductDes] = useState("");

  const conditionOptions = ["new", "old", "used", "refurbished"];
  const tagOptions = [
    "other",
    "electronics",
    "phones",
    "computers",
    "laptops",
    "clothes",
    "outdoor",
    "jewelry",
    "watches",
    "handbags",
    "gaming",
    "vehicules",
    "cars",
    "bicycles",
    "collectibles",
    "indoor",
    "books",
    "movies",
    "workout",
  ];
  const defaultTag = tagOptions[0];
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
    const curr = await Parse.User.current();
    if (curr == null) {
      alert("You are not logged in, please sign in");
      return;
    }
    if (curr.get("approved") === false) {
      alert("You can not sell a product till your account has been approved");
      return;
    }
    const userName = curr.get("username");
    console.log(userName);
    var myProduct = new Products();
    const productNameValue = product_name;
    const productCondValue = product_condition;
    const productBidValue = product_bid;
    const productTagValue = product_tag;
    const productDesValue = product_des;
    const base64 = result.split("64,").pop();

    try {
      var file = new Parse.File(image.name, { base64: base64 });
    } catch {
      // Error can be caused by wrong parameters or lack of Internet connection
      alert(
        "Image is unable to upload please try another image or a screenshot selected image"
      );
      return;
    }

    // Sets alls Values to be added to Back4app Parse Server
    myProduct.set("product_name", productNameValue);
    myProduct.set("prod_img", file);
    myProduct.set("product_tag", productTagValue);
    myProduct.set("prod_num", +productBidValue);
    myProduct.set("product_des", productDesValue);
    myProduct.set("last_day_bid", selectedDate);
    myProduct.set("product_condition", productCondValue);
    myProduct.set("product_uploader", userName);
    myProduct.set("sold", false);
    myProduct.set("product_name_lower", productNameValue.toLowerCase());
    myProduct.set("product_des_lower", productDesValue.toLowerCase());

    // Saves Function to Back4app Parse Server
    myProduct
      .save()
      .then(function (Products) {
        alert("Product Successfully Added");
        console.log(
          "Products created successful with name: " +
            myProduct.get("product_name") +
            " and date: " +
            myProduct.get("last_day_bid")
        );
      })
      .catch(function (error) {
        console.log("Error: " + error.message);
        alert("Error:" + error.message);
      });

    document.getElementById("productName").value = "";
    document.getElementById("image_input").value = "";
    document.getElementById("productBidDate").value = "";
    document.getElementById("productMinBid").value = "";
    document.getElementById("productDes").value = "";
  }

  return (
    <div id="screen">
      <Homebar />
      <div id="display">
        <div id="bodyProducts">
          <article class="reg">
            {" "}
            <h2>Add Product</h2>
            {/* Product Name */}
            <div id="sellRoundedCorner">
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
            <div id="sellRoundedCorner">
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
            <div id="sellRoundedCorner">
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
            <div id="sellRoundedCorner">
              <p id="Label">Choose Last Day to Bid for Product</p>
              <p>
                <DatePicker
                  id="productBidDate"
                  placeholderText="Press here to enter Date"
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
            <div id="sellRoundedCorner">
              <p id="Label">Select Product's Condition</p>
              <p>
                <Dropdown
                  options={conditionOptions}
                  placeholder={"Click to select Product's Condition"}
                  onChange={({ value }) => setProductCondition(value)}
                />
              </p>
            </div>
            {/* Product Tag */}
            <div id="sellRoundedCorner">
              <p id="Label">Select Product's Tag</p>
              <p>
                <Dropdown
                  options={tagOptions}
                  placeholder={"Click to select Product's Tag"}
                  onChange={({ value }) => setProductTag(value)}
                />
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
          <div id="sellRoundedCorner">
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
