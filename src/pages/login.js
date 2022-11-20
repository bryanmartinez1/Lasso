import "bootstrap/dist/css/bootstrap.css";
import "../styles/login.css";
import { React, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";
import Profile from "./profile";

function Login() {
  const [toSignup, setToSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  if (toSignup) {
    return <Navigate to="/Signup" />;
  }

  const doUserLogIn = async function () {
    // Note that these values come from state variables that we've declared before
    const usernameValue = username;
    const passwordValue = password;
    try {
      const loggedInUser = await Parse.User.logIn(usernameValue, passwordValue);
      // logIn returns the corresponding ParseUser object
      alert(
        `Success! User ${loggedInUser.get(
          "username"
        )} has successfully signed in!`
      );
      // To verify that this is in fact the current user, `current` can be used
      <Profile name={username} />;
      navigate("/Profile", { state: { name: usernameValue } });
      const currentUser = await Parse.User.current();
      console.log(loggedInUser === currentUser);
      console.log("username", username);

      // Clear input fields
      setUsername("");
      setPassword("");
      // Update state variable holding current user
      getCurrentUser();

      return true;
    } catch (error) {
      // Error can be caused by wrong parameters or lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const doUserLogOut = async function () {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      if (currentUser === null) {
        alert("Success! No user is logged in anymore!");
      }
      // Update state variable holding current user
      getCurrentUser();
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  // Function that will return current user and also update current username
  const getCurrentUser = async function () {
    const currentUser = await Parse.User.current();
    // Update state variable holding current user
    setCurrentUser(currentUser);
    return currentUser;
  };
  return (
    <section class="vh-100">
      <div class="container py-5 h-100">
        <div class="row">
          <div class="col-lg-6"></div>
          <div class="col-lg-6 col-xl-5 sign-col">
            <div class="card shadow-2-strong">
              <div class="card-body p-5 text-center">
                <h3 class="mb-5">Log In</h3>

                <div class="form-outline mb-4">
                  <input
                    type="email"
                    onChange={(event) => setUsername(event.target.value)}
                    id="typeEmailX-2"
                    class="form-control form-control-lg"
                  />
                  <label class="form-label" for="typeEmailX-2">
                    Username
                  </label>
                </div>

                <div class="form-outline mb-4">
                  <input
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    id="typePasswordX-2"
                    class="form-control form-control-lg"
                  />
                  <label class="form-label" for="typePasswordX-2">
                    Password
                  </label>
                </div>

                <div class="form-check d-flex justify-content-start mb-4">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="form1Example3"
                  />
                  <label class="form-check-label" for="form1Example3">
                    {" "}
                    Remember password{" "}
                  </label>
                </div>

                <button
                  class="btn btn-primary btn-lg btn-block"
                  onClick={() => doUserLogIn()}
                  type="submit"
                >
                  Sign In
                </button>

                <hr class="my-4" />
                <label class="form-check-label">
                  Don't have an account?{" "}
                  <button
                    class="signup-button"
                    onClick={() => {
                      setToSignup(true);
                    }}
                  >
                    Sign Up
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

export default Login;
