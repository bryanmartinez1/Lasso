import { React, useState } from "react";
import Parse from "parse/dist/parse.min.js";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import ProfileNavbar from "../components/profileNavbar";
import SendMessage from "./sendMessage";

function Admin() {
  const [displayUsers, setDisplayUsers] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const [queryResults, setQueryResults] = useState();
  const navigate = useNavigate();

  // builds the table of customer information
  function getCustomerRow() {
    return queryResults.map((user, index) => {
      return (
        <tr key={user.get("username")}>
          <td>{user.get("username")}</td>
          <td>{user.get("firstname") + " " + user.get("lastname")}</td>
          <td>
            {user.get("approved") ? "Approved" : "Unapproved"}
            <button
              onClick={() => {
                approveUser(queryResults[index]);
              }}
            >
              Approve?
            </button>
          </td>
          <td>{user.get("email")}</td>
          <td>
            <button
              onClick={() => {
                goToMessages(queryResults[index].get("username"));
              }}
            >
              Messages
            </button>
          </td>
        </tr>
      );
    });
  }

  function getProductRow() {
    return queryResults.map((product, index) => {
      return (
        <tr key={index}>
          <td>{product.get("product_name")}</td>
          <td>{product.get("product_uploader")}</td>
          <td>
            {product.get("approved") ? "Approved" : "Unapproved"}
            <button
              onClick={() => {
                approveProduct(queryResults[index]);
              }}
            >
              Approve
            </button>
            <button
              onClick={() => {
                goToMessages(
                  product.get("product_uploader"),
                  product.get("product_name") + " has been rejected"
                );
              }}
            >
              Reject
            </button>
          </td>
        </tr>
      );
    });
  }

  function getTransactionRow() {
    console.log(queryResults);
    return queryResults.map((transaction, index) => {
      return (
        <tr key={("buyer", "product")}>
          <td>{transaction.get("product")}</td>
          <td>{transaction.get("buyer")}</td>
          <td>{transaction.get("createdAt").toString()}</td>
        </tr>
      );
    });
  }
  // function to display users.
  async function usersOn() {
    const userQuery = new Parse.Query("User");
    try {
      const userResults = await userQuery.find();
      setQueryResults(userResults);
      setDisplayProducts(false);
      setDisplayUsers(true);
      setDisplayTransactions(false);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function producstOn() {
    const productQuery = new Parse.Query("Products");
    try {
      const productResults = await productQuery.find();
      setQueryResults(productResults);
      setDisplayProducts(true);
      setDisplayUsers(false);
      setDisplayTransactions(false);
      console.log("checking approval: ", queryResults[0].get("approved"));
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function transactionsOn() {
    const orderQuery = new Parse.Query("Orders");
    try {
      const orderResults = await orderQuery.find();
      setQueryResults(orderResults);
      setDisplayProducts(false);
      setDisplayUsers(false);
      setDisplayTransactions(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  const approveUser = async function (user) {
    try {
      user.set("approved", true);
      await user.save({ useMasterKey: true });
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };

  const approveProduct = async function (product) {
    console.log("approving: ");
    try {
      product.set("approved", true);
      await product.save();
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };

  // need to pass sender too.
  function goToMessages(username, t) {
    navigate("/sendmessage", {
      state: { recipient: username, topic: t },
    });
  }

  return (
    <section id="section_background">
      <ProfileNavbar />
      <div id="row_div">
        <div id="column_div">
          <div id="side_bar">
            <button id="side_nav_bt" onClick={usersOn}>
              Display Users
            </button>
            <button id="side_nav_bt" onClick={producstOn}>
              Display Products
            </button>
            <button id="side_nav_bt" onClick={transactionsOn}>
              Display Transactions
            </button>
          </div>
        </div>
        <div>
          {displayUsers && (
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Approved?</th>
                  <th>Email</th>
                  <th>Send Message</th>
                </tr>
              </thead>
              <tbody>{getCustomerRow()}</tbody>
            </table>
          )}

          {displayProducts && (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Uploader Name</th>
                  <th>Approved?</th>
                </tr>
              </thead>
              <tbody>{getProductRow()}</tbody>
            </table>
          )}

          {displayTransactions && (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Buyer Name</th>
                  <th>Time of Purchase</th>
                </tr>
              </thead>
              <tbody>{getTransactionRow()}</tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;
