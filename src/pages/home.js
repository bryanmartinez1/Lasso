import React from "react";
import "../styles/home.css";
import { useNavigate, Navigate } from "react-router-dom";
import HomeBar from "../components/homebar.js";
import { Components } from "antd/lib/date-picker/generatePicker";

function Home() {
  const [toSignup, setToSignup] = React.useState(false);
  if (toSignup) {
    return <Navigate to="/Signup" />;
  }
  return (
    <section>
      <HomeBar />
    </section>
  );
}
export default Home;
