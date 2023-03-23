import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Product from "../components/Product";
import HomeBar from "../components/homebar.js";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";
import Parse from "parse/dist/parse.min.js";

function Home() {
  const [queryResults, setQueryResults] = useState();
  const [show, setShow] = useState(false);

  async function doQuery() {
    let productQuery = new Parse.Query("Products");

    productQuery.equalTo("approved", true);
    productQuery.equalTo("sold", false);

    try {
      const productResults = await productQuery.find();
      setQueryResults(productResults);
      setShow(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getProducts() {
    return queryResults.map((product) => {
      return <Product product={product} />;
    });
  }

  if (show === false) {
    doQuery();
  }

  return (
    <section>
      <div id="homebackground">
        <HomeBar />
        {show && <div className="display">{getProducts()}</div>}
        <ScrollButtons />
        <Footer />
      </div>
    </section>
  );
}
export default Home;
