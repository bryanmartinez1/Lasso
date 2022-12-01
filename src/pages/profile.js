import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import HomeBar from "../components/homebar";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Profile() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;
  console.log("Profile:", data);

  const [firstname, setFirstName] = useState(data.fname);
  const [lastname, setLastName] = useState(data.lname);
  const [password, setPassword] = useState(data.password);
  const [address, setAddress] = useState(data.address);
  const [phonenumber, setPhoneNumber] = useState(data.phonenumber);
  const [creditcardnumber, setCreditCardNumber] = useState(
    data.creditcardnumber
  );

  const updateProfile = async function () {
    try {
      const currentUser = await Parse.User.current();
      currentUser.set("firstname", firstname);
      currentUser.set("lastname", lastname);
      currentUser.set("password", password);
      currentUser.set("address", address);
      currentUser.set("phonenumber", phonenumber);
      currentUser.set("creditcardnumber", creditcardnumber);
      await currentUser.save();
      alert("Success, your Profile was updated!");
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };

  return (
    <section class="vh-100">
      <HomeBar />
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100 main-div">
          <div class="col-lg-6"></div>
          <div class="col-md-8 col-lg-6 col-xl-5 sign-col">
            <div class="card shadow-2-strong signup-card">
              <div class="card-body p-5 text-center">
                <h3 class="mb-5">Profile</h3>
                <div class="fname-cont">
                  <div class="form-outline mb-4 st-name">
                    <input
                      value={firstname}
                      onChange={(event) => setFirstName(event.target.value)}
                      type="text"
                      class="form-control form-control-lg"
                    />
                  </div>
                  <div class="form-outline mb-4 lst-name">
                    <input
                      value={lastname}
                      onChange={(event) => setLastName(event.target.value)}
                      type="text"
                      class="form-control form-control-lg"
                    />
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter New Password"
                    type="password"
                    id="typePasswordX-2"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    type="text"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4 lst-name">
                  <input
                    value={phonenumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    type="text"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4 lst-name">
                  <input
                    value={creditcardnumber}
                    onChange={(event) =>
                      setCreditCardNumber(event.target.value)
                    }
                    type="text"
                    class="form-control form-control-lg"
                  />
                </div>
                <div>
                  <input
                    type="submit"
                    value="Submit Edit"
                    onClick={() => updateProfile()}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
