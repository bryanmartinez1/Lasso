import React, { useState } from "react";
import ProfileNavbar from "../components/profileNavbar";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import Product from "../components/Product";
import { useLocation } from "react-router-dom";
import "react-dropdown/style.css";

export default function SearchResult() {
  const location = useLocation();
  const data = location.state;
  if (data === null) {
    data.searchResult = "";
  }

  const [queryResults, setQueryResults] = useState();
  const [showProducts, setShowProducts] = useState(false);
  const [welcome, setWelcome] = useState(true);

  const doQuery = async function () {
    // initializing quieres
    const productTagQuery = new Parse.Object.extend("Products");
    const productNameQuery = new Parse.Object.extend("Products");
    const productDesQuery = new Parse.Object.extend("Products");
    const productSellerQuery = new Parse.Object.extend("Products");

    //setting sort
    try {
      // Only keeps approved products to quieres
      const tag = new Parse.Query(productTagQuery);
      const name = new Parse.Query(productNameQuery);
      const descriptions = new Parse.Query(productDesQuery);
      const seller = new Parse.Query(productSellerQuery);

      // Keeps products that contains what was searched in the tag/name/description
      tag.contains("product_tag", data.searchResult.toLowerCase());
      name.contains("product_name_lower", data.searchResult.toLowerCase());
      descriptions.contains(
        "product_des_lower",
        data.searchResult.toLowerCase()
      );
      seller.contains("product_uploader", data.searchResult.toLowerCase());

      //Combines the 3 quieres
      const products = new Parse.Query("Products");
      products._orQuery([tag, name, descriptions, seller]);

      products.equalTo("approved", true);
      products.equalTo("sold", false);

      console.log("Sorting: " + data.sort);
      console.log("Max:" + data.maxPrice);
      console.log("Min:" + data.minPrice);

      //Filtering out products with prices greater than the max price
      if (data.maxPrice != -1) {
        products.lessThanOrEqualTo("minbid", data.maxPrice);
      }
      //Filtering out products with prices less than the min price
      if (data.minPrice != 0) {
        products.greaterThanOrEqualTo("minbid", data.minPrice);
      }
      //
      // Figure out how to sort for ratings
      //
      // Sorting
      if (data.sort === "Rating") {
        console.log("Sorting via Rating");
      } else if (data.sort === "Price: Low to High") {
        products.addAscending("minbid");
      } else if (data.sort === "Price: High to Low") {
        products.addDescending("prod_num");
      }

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
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }

  return (
    <div>
      {" "}
      <HomeBar />
      {/* {currentUser === null ? <HomeBar /> : <ProfileNavbar />} */}
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
