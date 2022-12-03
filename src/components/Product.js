import React from "react";
import { Link } from "react-router-dom";

export default function Product({ product }) {
  return (
    <div className="col-md-3 m-5 card p-2">
      <div>
        <Link to="/pages/productDescription" state={{ product: product }}>
          <img src={product.get("image")} className="img-fluid" />
          <h1>Name: {product.get("product_name")}</h1>
          <h1>Description: {product.get("product_des")}</h1>
          <h1>Tags: {product.get("product_tag")}</h1>
        </Link>
      </div>
    </div>
  );
}
