import React from "react";
import { useLocation } from "react-router-dom";
import products from "../products";

export default function ProductDescription() {
  const location = useLocation();
  const data = location.state;
  console.log(data);

  return (
    <div>
      <h1>Product Description</h1>
    </div>
  );
}
