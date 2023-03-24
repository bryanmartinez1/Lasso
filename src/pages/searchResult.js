import React, { useState } from "react";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import Product from "../components/Product";
import Dropdown from "react-dropdown";
import { useLocation } from "react-router-dom";
import "../styles/search.css";
import { useEffect } from "react";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";

export default function SearchResult() {
  const location = useLocation();
  const data = location.state;
  if (data === null) {
    data.searchResult = "";
  }

  const [sort, setSort] = useState("Default");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("none");
  const [queryResults, setQueryResults] = useState();

  const sortOptions = [
    "Default",
    "Low to High",
    "High to Low",
    "A - Z",
    "Z - A",
  ];

  const categoryOptions = [
    "none",
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

  const changeMin = (event) => {
    let newMin = event.target.value;
    if (newMin <= maxPrice) {
      setMinPrice(Number(newMin));
      return;
    }
    alert("Min Price can not be greater than current max price");
  };
  const changeMax = (event) => {
    let newMax = event.target.value;
    if (newMax === 0) {
      newMax = 1000000000;
    }
    if (newMax >= minPrice) {
      setMaxPrice(Number(newMax));
      return;
    }
    alert("Min Price can not be greater than current max price");
  };

  useEffect(() => {
    console.log("Search: " + data.searchResult);
    console.log("Sort: " + sort);
    console.log("Min Price: " + minPrice);
    console.log("Max Price: " + maxPrice);
    doSearch(data.searchResult, sort, minPrice, maxPrice, category);
  }, [data.searchResult, sort, minPrice, maxPrice, category]);

  async function doSearch(search, sortVal, minVal, maxVal, categoryVal) {
    const productTagQuery = new Parse.Object.extend("Products");
    const productNameQuery = new Parse.Object.extend("Products");
    const productDesQuery = new Parse.Object.extend("Products");
    const productSellerQuery = new Parse.Object.extend("Products");

    try {
      const tag = new Parse.Query(productTagQuery);
      const name = new Parse.Query(productNameQuery);
      const descriptions = new Parse.Query(productDesQuery);
      const seller = new Parse.Query(productSellerQuery);

      tag.contains("product_tag", search.toLowerCase());
      name.contains("product_name_lower", search.toLowerCase());
      descriptions.contains("product_des_lower", search.toLowerCase());
      seller.contains("product_uploader", search.toLowerCase());

      const products = new Parse.Query("Products");
      products._orQuery([tag, name, descriptions, seller]);

      products.equalTo("approved", true);
      products.equalTo("sold", false);
      products.greaterThanOrEqualTo("prod_num", minVal);
      products.lessThanOrEqualTo("prod_num", maxVal);

      if (sortVal === "Low to High") {
        products.addAscending("prod_num");
      }
      if (sortVal === "High to Low") {
        products.addDescending("prod_num");
      }
      if (sortVal === "A - Z") {
        products.addAscending("product_name");
      }
      if (sortVal === "Z - A") {
        products.addDescending("product_name");
      }

      if (categoryVal !== "none") {
        products.equalTo("product_tag", categoryVal);
      }

      const productResults = await products.find();
      setQueryResults(productResults);
      setShow(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function showSearch() {
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }

  return (
    <div>
      {" "}
      <HomeBar />
      <div className="secondaryBar">
        <Dropdown
          options={sortOptions}
          placeholder="Sort By"
          onChange={({ value }) => setSort(value)}
        />
        <div>
          Min Price: ${"   "}
          <input type="number" onChange={changeMin} />
        </div>
        <div>
          Max Price: ${"   "}
          <input type="number" onChange={changeMax} />
        </div>
        <Dropdown
          options={categoryOptions}
          placeholder="Category"
          onChange={({ value }) => setCategory(value)}
        />
      </div>
      {show && <div className="display">{showSearch()}</div>}
      <ScrollButtons />
      <Footer />
    </div>
  );
}
