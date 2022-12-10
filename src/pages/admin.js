import { React, useState } from "react";
import Parse from "parse/dist/parse.min.js";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import ProfileNavbar from "../components/profileNavbar";

function Admin() {
  const [displayUsers, setDisplayUsers] = useState(false);
  const [displayProducts, setDisplayProducts] = useState(false);
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const [displayMessages, setDisplayMessgaes] = useState(false);
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
            <button
              onClick={() => {
                goToMessages(
                  queryResults[index].get("username"),
                  "Account Rejected"
                );
              }}
            >
              Reject
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
        <tr key={index}>
          <td>{transaction.get("product")}</td>
          <td>{transaction.get("buyer")}</td>
          <td>{transaction.get("createdAt").toString()}</td>
        </tr>
      );
    });
  }
  // function to display users.
  async function usersOn() {
    const userQuery = new Parse.Query("User").descending("createdAt");
    try {
      const userResults = await userQuery.find();
      setQueryResults(userResults);
      setDisplayProducts(false);
      setDisplayUsers(true);
      setDisplayMessgaes(false);
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
      setDisplayMessgaes(false);
      setDisplayTransactions(false);
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
      setDisplayMessgaes(false);
      setDisplayTransactions(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function userMessagesOn() {
    const curr = await Parse.User.current();
    const messageQuery = new Parse.Query("Messages");
    messageQuery.contains("recipient", curr.get("username"));
    try {
      const messageResults = await messageQuery.find();
      setQueryResults(messageResults);
      setDisplayProducts(false);
      setDisplayUsers(false);
      setDisplayTransactions(false);
      setDisplayMessgaes(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getMessageRow() {
    return queryResults.map((message, index) => {
      return (
        <tr key={index}>
          <td>{message.get("sender")}</td>
          <td>{message.get("topicline")}</td>
          <td>
            <textarea readOnly value={message.get("content")}></textarea>
          </td>
        </tr>
      );
    });
  }

  const approveUser = async function (user) {
    try {
      user.set("approved", true);
      await user.save({ useMasterKey: true });
      alert("User has been approved");
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
            <button id="side_nav_bt" onClick={userMessagesOn}>
              Messages
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

          {displayMessages && (
            <table className="table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Topic</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>{getMessageRow()}</tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;
