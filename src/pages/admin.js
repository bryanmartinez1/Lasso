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
  const [displayUserTransactions, setDisplayUserTransactions] = useState(false);
  const [queryResults, setQueryResults] = useState();
  const navigate = useNavigate();

  // builds the table of customer information
  // get rating query, sort by creation date along with user query,
  // ratingResults[index].rating
  function getCustomerRow() {
    return queryResults.map((user, index) => {
      return (
        <tr key={user.get("username")}>
          <td>{user.get("username")}</td>
          <td>{user.get("firstname") + " " + user.get("lastname")}</td>
          <td>
            {user.get("approved") ? "Approved" : "Unapproved"}
            <button class="m-2 btn btn-primary btn-sm btn-success"
              onClick={() => {
                approveUser(queryResults[index]);
              }}
            >
              Approve?
            </button>
            <button class="m-2 btn btn-primary btn-sm btn-danger"
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
            <button class="btn btn-secondary"
              onClick={() => {
                goToMessages(queryResults[index].get("username"));
              }}
            >
              Messages
            </button>
          </td>
          <td>
            <button class="btn btn-outline-dark" onClick={() => getUserTransactions(user.get("username"))}>
              View Transactions
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
          <td style={{ color: "Blue" }}>
            {product.get("approved") ? "Approved" : "Unapproved"}
            <button class="m-2 btn btn-primary btn-sm btn-success"
              onClick={() => {
                approveProduct(queryResults[index]);
              }}
            >
              Approve
            </button>
            <button class="m-2 btn btn-primary btn-sm btn-danger"
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
    return queryResults.map((transaction, index) => {
      return (
        <tr key={index}>
          <td>{transaction.get("product")}</td>
          <td>{transaction.get("buyer")}</td>
          <td>{transaction.get("seller")}</td>
          <td>${transaction.get("amount")}</td>
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
      setDisplayUserTransactions(false);
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
      setDisplayUserTransactions(false);
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
      setDisplayUserTransactions(false);
      setDisplayMessgaes(false);
      setDisplayTransactions(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  async function getUserTransactions(username) {
    const transactionQuery = new Parse.Query("Orders").contains(
      "buyer",
      username
    );
    try {
      const transactionResults = await transactionQuery.find();
      setQueryResults(transactionResults);
      setDisplayProducts(false);
      setDisplayUsers(false);
      setDisplayMessgaes(false);
      setDisplayTransactions(false);
      setDisplayUserTransactions(true);
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  }

  function getUserTransactionRow() {
    return queryResults.map((transaction, index) => {
      return (
        <tr key={index}>
          <td>{transaction.get("product")}</td>
          <td>{transaction.get("seller")}</td>
          <td>${transaction.get("amount")}</td>
          <td>{transaction.get("createdAt").toString()}</td>
        </tr>
      );
    });
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
      setDisplayUserTransactions(false);
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
        <div id="backgrund">
          {displayUsers && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Username</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Full Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Approved?</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Email</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Send Message</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Transactions</th>
                </tr>
              </thead>
              <tbody>{getCustomerRow()}</tbody>
            </table>
          )}

          {displayProducts && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Product Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Uploader Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Approved?</th>
                </tr>
              </thead>
              <tbody>{getProductRow()}</tbody>
            </table>
          )}

          {displayTransactions && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Product Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Buyer Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Seller Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Amount</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Time of Purchase</th>
                </tr>
              </thead>
              <tbody>{getTransactionRow()}</tbody>
            </table>
          )}

          {displayUserTransactions && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Product Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Seller Name</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Amount</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Time of Purchase</th>
                </tr>
              </thead>
              <tbody>{getUserTransactionRow()}</tbody>
            </table>
          )}

          {displayMessages && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Sender</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Topic</th>
                  <th style={{ color: "white", border: "solid", backgroundColor: "skyblue",
                      padding: "10px",fontFamily: "Arial",}}>Content</th>
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
