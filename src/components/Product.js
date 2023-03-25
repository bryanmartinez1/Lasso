import React from "react";
import { Link } from "react-router-dom";
import logo from "./Images/logo_s.jpg";
import "../styles/product.css";

export default function Product({ product }) {
  const stringify = JSON.stringify(product.get("prod_img"));
  const imageURL = stringify.split('url":"').pop().slice(0, -2);

  return (
    <div className="col-md-2 m-5 card p-2">
      <div>
        <Link
          className="words"
          to="/pages/productDescription"
          state={{
            product: product.get("product_name"),
            seller: product.get("product_uploader"),
            imgURL: imageURL,
            bidEnd: product.get("last_day_bid"),
            minBid: product.get("minbid"),
            condition: product.get("product_condition"),
            description: product.get("product_des"),
            tag: product.get("product_tag"),
          }}
        >
          <img src={imageURL} className="imageHome" />
          <p>{product.get("product_name")}</p>
          <p>${product.get("prod_num")}</p>
          <p>{product.get("product_tag")}</p>
        </Link>
      </div>
    </div>
  );
}
