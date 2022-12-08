import React from "react";
import { useEffect } from "react";
import { useCart } from "react-use-cart";
import Product from "../components/Product";
import HomeBar from "../components/homebar.js";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";

export default function Cart() {
  const { items, totalItems, cartTotal, emptyCart } = useCart();
  console.log(items);

  useEffect(() => {
    console.log("cart should be empty");
  }, [items]);

  return (
    <div>
      <HomeBar />
      <div className="products">
        {items.map((item) => {
          return <Product product={item} showItemData={false} />;
        })}
      </div>
      <div className="cart-total-items">
        Cart Total: {`${cartTotal}`} <br></br>
        Cart Items: {`${totalItems}`} <br></br>
        <button
          onClick={() => {
            emptyCart();
          }}
        >
          clear cart
        </button>
      </div>
      <ScrollButtons />
      <Footer />
    </div>
  );
}