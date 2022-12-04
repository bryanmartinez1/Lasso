import React from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo_s.jpg";

export default function Product({ product }) {
  console.log("Image: " + product.get("prod_img"));
  const stringify = JSON.stringify(product.get("prod_img"));
  console.log("Image: " + stringify);
  const pop = stringify.split('url":"').pop().slice(0, -2);
  console.log("Sliced " + pop);

  var tempURL =
    "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350";

  return (
    <div className="col-md-3 m-5 card p-2">
      <div>
        <Link
          to="/pages/productDescription"
          state={{
            productname: product.get("product_name"),
            sellername: product.get("product_uploader"),
            imgURL: pop,
          }}
        >
          <img src={pop} className="img-fluid" />
          <h1>Name: {product.get("product_name")}</h1>
          <h1>Description: {product.get("product_des")}</h1>
          <h1>Tags: {product.get("product_tag")}</h1>
        </Link>
      </div>
    </div>
  );
}
