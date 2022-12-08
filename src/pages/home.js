import React, { useEffect, useState } from "react";
import "../styles/home.css";
import products from "../products";
import Product from "../components/Product";
import { useNavigate, Navigate } from "react-router-dom";
import HomeBar from "../components/homebar.js";
import { Components } from "antd/lib/date-picker/generatePicker";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";
import Parse from "parse/dist/parse.min.js";
import { useParseQuery } from "@parse/react";

function Home() {
  const [toSignup, setToSignup] = React.useState(false);
  const [queryResults, setQueryResults] = useState();
  const [showProducts, setShowProducts] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // filter products to only display approved
  const doQuery = async function () {
    const productQuery = new Parse.Query("Products");
    const curr = await Parse.User.current();
    try {
      const productResults = await productQuery.find();
      setCurrentUser(curr);
      setQueryResults(productResults);
      setWelcome(false);
      setShowProducts(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  if (toSignup) {
    return <Navigate to="/Signup" />;
  }

  function getProducts() {
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }

  return (
    <section>
      <div id="homebackground">
        <HomeBar />
        {welcome && 
        <button class="m-3 btn btn-primary btn-lg" onClick={doQuery}>Click to access</button>}
        {showProducts && (
          <div>
            <h2 style={{ color: "purple" }}>Welcome, {currentUser.get("username")}!</h2>
            <div className="row justify-content-center">{getProducts()}</div>
          </div>
        )}

        <ScrollButtons />
        <Footer />
      </div>
    </section>
  );
}
export default Home;
