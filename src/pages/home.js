import React from "react";
import "../styles/home.css";
import "../styles/product.css";
import products from "../products"
import Product from '../pages/Product'
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
        <div className="home__row">
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />          
        </div>
        <div className="home__row">
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />          
        </div>
        <div className="home__row">
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
            <Product 
            id = "1234"
            title = "Model Name Zeb-Yoga 101 Color Red Headphone"
            price = {1200}
            rating = {3}
            image = "https://rukminim1.flixcart.com/image/416/416/khp664w0-0/headphone/p/d/k/zeb-yoga-101-zebronics-original-imafxnkdwzt4gzhg.jpeg?q=70" 
            />  
                     
        </div>
      </div>
      
      <ScrollButtons />
      <Footer />
      </div>
    </section>
  );
}
export default Home;
