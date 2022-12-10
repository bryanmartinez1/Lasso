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
    // initializing quieres
    const productTagQuery = new Parse.Object.extend("Products");
    const productNameQuery = new Parse.Object.extend("Products");
    const productDesQuery = new Parse.Object.extend("Products");
    try {
      // Only keeps approved products to quieres
      const aprrovedTag = new Parse.Query(productTagQuery);
      const aprrovedName = new Parse.Query(productNameQuery);
      const aprrovedDes = new Parse.Query(productDesQuery);
      aprrovedTag.equalTo("approved", true);
      aprrovedName.equalTo("approved", true);
      aprrovedDes.equalTo("approved", true);

      // Keeps products that contains what was searched in the tag/name/description
      aprrovedTag.contains("product_tag", data.searchResult.toLowerCase());
      aprrovedName.contains(
        "product_name_lower",
        data.searchResult.toLowerCase()
      );
      aprrovedDes.contains("product_des", data.searchResult.toLowerCase());

      // Keeps products that have not been sold yet
      aprrovedTag.equalTo("sold", false);
      aprrovedName.equalTo("sold", false);
      aprrovedDes.equalTo("sold", false);

      //Combines the 3 quieres
      const products = new Parse.Query("Products");
      products._orQuery([aprrovedTag, aprrovedName, aprrovedDes]);

      //Sets the results
      const productResults = await products.find();
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
    if (queryResults === null) {
      return <h1>Nothing found. try differnt search</h1>;
    }
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
