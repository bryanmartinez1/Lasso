import "bootstrap/dist/css/bootstrap.css";
import "../styles/signup.css";
import { useNavigate, Navigate } from "react-router-dom";

import React, { useState } from "react";
import Parse from "parse/dist/parse.min.js";
// import { Button, Divider, Input } from "antd";

import { App_Id, JavaScript_key, Host_Server } from "../KEYS.js";

Parse.initialize(App_Id, JavaScript_key); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = Host_Server;

function Signup() {
  // State variables
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toSignin, setToSignin] = useState(false);

  if (toSignin) {
    return <Navigate to="/login" />;
  }

  // Functions used by the screen components
  const doUserRegistration = async function () {
    // Note that these values come from state variables that we've declared before
    const firstNameValue = firstname;
    const lastNameValue = lastname;
    const usernameValue = username;
    const emailValue = email;
    const passwordValue = password;
    const confirmPasswordValue = confirmPassword;

    try {
      // Since the signUp method returns a Promise, we need to call it using await
      const user = new Parse.User();
      user.set("firstname", firstNameValue);
      user.set("lastname", lastNameValue);
      user.set("username", usernameValue);
      user.set("password", passwordValue);
      user.set("email", emailValue);
      user.set("balance", 0);
      user.set("address", "");
      user.set("phonenumber", "");
      user.set("creditcardnumber", "");

      let newBalance = new Parse.Object("UserBalance");
      newBalance.set("username", usernameValue);
      newBalance.set("amount", 0);
      newBalance.save();

      let newRating = new Parse.Object("Ratings");
      newRating.set("username", usernameValue);
      newRating.set("numratings", 0);
      newRating.set("ratings", []);
      newRating.save();
      // setting the ACL for the user to allow access for admins to view,change,delete user data
      let userACL = new Parse.ACL();
      userACL.setPublicReadAccess(true);
      userACL.setRoleReadAccess("admin", true);
      userACL.setRoleWriteAccess("admin", true);
      user.set("ACL", userACL);

      if (passwordValue !== confirmPasswordValue) {
        throw Error("Mismatching Passwords");
      }

      const createdUser = await user.signUp();
      alert(
        `Success! User ${createdUser.getUsername()} was successfully created!`
      );

      // setting role currently does not work
      let rolesQuery = new Parse.Query(Parse.Role);
      rolesQuery.equalTo("name", "regular");
      let roles = await rolesQuery.first();
      if (roles) {
        roles.getUsers().add(createdUser);
        roles.save();
      }

      navigate("/login");
      return true;
    } catch (error) {
      // signUp can fail if any parameter is blank or failed an uniqueness check on the server
      alert(`Error! ${error}`);
      return false;
    }
  };

  return (
    <section class="vh-100">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100 main-div">
          <div class="col-lg-6"></div>
          <div class="col-md-8 col-lg-6 col-xl-5 sign-col">
            <div class="card shadow-2-strong signup-card">
              <div class="card-body p-5 text-center">
                <h3 class="mb-5">Sign Up</h3>
                <div class="fname-cont">
                  <div class="form-outline mb-4 st-name">
                    <input
                      value={firstname}
                      onChange={(event) => setFirstName(event.target.value)}
                      type="text"
                      placeholder="First Name"
                      class="form-control form-control-lg"
                    />
                  </div>
                  <div class="form-outline mb-4 lst-name">
                    <input
                      value={lastname}
                      onChange={(event) => setLastName(event.target.value)}
                      type="text"
                      placeholder="Last Name"
                      class="form-control form-control-lg"
                    />
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                    type="text"
                    id="typeNameX-3"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    id="typeEmailX-2"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                    id="typePasswordX-2"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type="password"
                    placeholder="Confirm Passowrd"
                    id="typePasswordX-3"
                    class="form-control form-control-lg"
                  />
                </div>

                <button
                  class="btn btn-primary btn-lg btn-block"
                  type="submit"
                  onClick={() => doUserRegistration()}
                  // type="primary"
                  className="form_button"
                >
                  Sign Up
                </button>

                <hr class="my-4" />
                <label class="form-check-label">
                  Already have an account?{" "}
                  <button
                    class="signin-button"
                    onClick={() => {
                      setToSignin(true);
                    }}
                  >
                    Sign In
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
