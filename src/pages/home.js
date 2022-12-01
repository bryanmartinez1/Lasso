import React from "react";
import "../styles/home.css";
import products from "../products"
import Product from "../components/Product"
import { useNavigate, Navigate } from "react-router-dom";
import HomeBar from "../components/homebar.js";
import { Components } from "antd/lib/date-picker/generatePicker";
import Footer from "../components/footer.js";
import ScrollButtons from "../components/backtoTop";
function Home() {
  const [toSignup, setToSignup] = React.useState(false);
  if (toSignup) {
    return <Navigate to="/Signup" />;
  }
  return (
    <section>
      <div style= {{backgroundColor:"white"}}>
      
      <HomeBar />
      <div>
        <div className="row justify-content-center">
          {products.map(product=>{
            return <Product product={product} />
          })}
        </div>
      </div>
      
      <ScrollButtons />
      <Footer />
      </div>
    </section>
  );
}
export default Home;
