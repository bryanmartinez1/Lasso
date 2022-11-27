import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Parse from "parse/dist/parse.min.js";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Profile() {
  const location = useLocation();
  //the data here will be an object since an object was
  const data = location.state;
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [creditcardnumber, setCreditCardNumber] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // on load store the current user in userProfile state, to access attributes.
  useEffect(() => {
    const getCurrentUser = async function () {
      try {
        const currentUser = await Parse.User.current();
        setUserProfile(currentUser);
        return true;
      } catch (error) {
        // Error can be caused by wrong parameters or lack of Internet connection
        alert(`Error! ${error.message}`);
        return false;
      }
    };
    getCurrentUser();
  }, []);

  const updateProfile = async function () {
    const firstNameValue = firstname;
    const lastNameValue = lastname;
    const usernameValue = username;
    const passwordValue = password;
    const addressValue = address;
    const phonenumberValue = phonenumber;
    const creditcardnumberValue = creditcardnumber;

    try {
      userProfile.set("firstname", firstNameValue);
      userProfile.set("lastname", lastNameValue);
      userProfile.set("username", usernameValue);
      userProfile.set("password", passwordValue);
      userProfile.set("address", addressValue);
      userProfile.set("phonenumber", phonenumberValue);
      userProfile.set("creditcardnumber", creditcardnumberValue);
      console.log(userProfile.attributes);
      userProfile.save();
      return true;
    } catch (error) {
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
                <h3 class="mb-5">Profile</h3>
                <div class="fname-cont">
                  <div class="form-outline mb-4 st-name">
                    <input
                      value={firstname}
                      onChange={(event) => setFirstName(event.target.value)}
                      type="text"
                      placeholder={userProfile.attributes.firstname}
                      class="form-control form-control-lg"
                    />
                  </div>
                  <div class="form-outline mb-4 lst-name">
                    <input
                      value={lastname}
                      onChange={(event) => setLastName(event.target.value)}
                      type="text"
                      placeholder={userProfile.attributes.lastname}
                      class="form-control form-control-lg"
                    />
                  </div>
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="newPassword"
                    type="password"
                    id="typePasswordX-2"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4">
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder={userProfile.attributes.address}
                    type="text"
                    class="form-control form-control-lg"
                  />
                </div>

                <div class="form-outline mb-4 lst-name">
                  <input
                    value={phonenumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    type="text"
                    placeholder={userProfile.attributes.phonenumber}
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
                    placeholder={userProfile.attributes.creditcardnumber}
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
