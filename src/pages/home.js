import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Product from "../components/Product";
import { useNavigate, Navigate } from "react-router-dom";
import HomeBar from "../components/homebar.js";
import { Components } from "antd/lib/date-picker/generatePicker";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";
import Parse from "parse/dist/parse.min.js";
import { useParseQuery } from "@parse/react";
import { useCart } from "react-use-cart";

// to add: distinguish between admin/guest and regular user
// on load set a  boolean for admin or regular or guest
function Home() {
  const [toSignup, setToSignup] = React.useState(false);
  const [queryResults, setQueryResults] = useState();
  const [showProducts, setShowProducts] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  //for cart
  const { emptyCart, clearCartMetadata, items } = useCart();

  // filter products to only display approved

  async function doQuery(search) {
    let productQuery = new Parse.Query("Products");

    productQuery.equalTo("approved", true);
    productQuery.equalTo("sold", false);

    try {
      const productResults = await productQuery.find();
      setQueryResults(productResults);
      setShow(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  if (toSignup) {
    return <Navigate to="/Signup" />;
  }

  function getProducts() {
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }
  if (show === false) {
    doQuery(search);
  }
  return (
    <section>
      <div id="homebackground">
        <HomeBar />
        {show && <div className="display">{getProducts()}</div>}
        <ScrollButtons />
        <Footer />
      </div>
    </section>
  );
}
export default Home;
