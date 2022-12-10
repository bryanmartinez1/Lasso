import React, { useState } from "react";
import ProfileNavbar from "../components/profileNavbar";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import Product from "../components/Product";
import { useLocation } from "react-router-dom";

export default function SearchResult() {
  const location = useLocation();
  const data = location.state;
  if (data === null) {
    data.searchResult = "";
  }
  const [currentUser, setCurrentUser] = useState("");
  const getCurrentUser = async function () {
    const currentUser = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };

  getCurrentUser();

  const [queryResults, setQueryResults] = useState();
  const [showProducts, setShowProducts] = useState(false);
  const [welcome, setWelcome] = useState(true);

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

  function getProducts() {
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }

  return (
    <div>
      {" "}
      {currentUser === null ? <HomeBar /> : <ProfileNavbar />}
      {welcome && (
        <button class="m-3 btn btn-primary btn-lg" onClick={doQuery}>
          Show Results
        </button>
      )}
      {showProducts && (
        <div>
          <h2 style={{ color: "purple" }}></h2>
          <div className="row justify-content-center">{getProducts()}</div>
        </div>
      )}
    </div>
  );
}
