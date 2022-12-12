import React, { useState } from "react";
import HomeBar from "../components/homebar.js";
import Parse from "parse/dist/parse.min.js";
import Product from "../components/Product";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";
import Dropdown from "react-dropdown";

export default function Search() {
  const location = useLocation();
  const data = location.state;

  const [sort, setSort] = useState("Default");
  // Dropdown options
  const sortOptions = [
    "Default",
    "Rating",
    "Price: Low to High",
    "Price: High to Low",
  ];
  const deafultOption = sortOptions[0];
  //Navigate to the Search Results with inputted fields
  const navigate = useNavigate();
  const navConfirmResult = (event) => {
    var max = document.getElementById("maxPrice").value;
    var min = document.getElementById("minPrice").value;
    // If max or min inputs are not stated
    if (max === "") {
      max = "-1";
    }
    if (min === "") {
      min = "0";
    }
    // If max is stated and is less than min
    if (max != "-1" && Number(max) < Number(min)) {
      alert("Max Price can not be less than min price");
      return;
    }
    navigate("/searchResult", {
      state: {
        searchResult: data.searchResult,
        sort: sort,
        maxPrice: Number(max),
        minPrice: Number(min),
      },
    });
  };

  return (
    <div>
      {" "}
      <HomeBar />
      <div id="Sort_Filter">
        {" "}
        <div>Max Price</div>
        <input
          type="number"
          min="0"
          placeholder="Optional"
          id="maxPrice"
        ></input>
        <div>Min Price</div>
        <input
          type="number"
          placeholder="Optional"
          min="0"
          id="minPrice"
        ></input>
        <div>Sort</div>
        <Dropdown
          options={sortOptions}
          value={deafultOption}
          id="sort"
          onChange={({ value }) => setSort(value)}
        />
      </div>
      <div>You searched {data.searchResult}</div>
      <button class="m-3 btn btn-primary btn-lg" onClick={navConfirmResult}>
        Confirm Search
      </button>
    </div>
  );
}
