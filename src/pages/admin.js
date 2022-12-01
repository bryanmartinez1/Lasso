import { React, useState, useEffect } from "react";
import NavBar from "./../components/NavBar.js";
import Parse from "parse/dist/parse.min.js";
import { useNavigate, Navigate } from "react-router-dom";
import "../styles/admin.css";
import HomeBar from "../components/homebar";

function Admin() {
  const [displayUsers, setDisplayUsers] = useState(false);
  const [userList, setUserList] = useState();
  const [displayProducts, setDisplayProducts] = useState(false);
  const [productList, setProductList] = useState();
  const [transactionList, setTransactionList] = useState();
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const doQuery = async function () {
      const userQuery = new Parse.Query("User");
      const productQuery = new Parse.Query("Products");
      const orderQuery = new Parse.Query("Orders");
      try {
        const userResults = await userQuery.find();
        setUserList(userResults);
        const productResults = await productQuery.find();
        setProductList(productResults);
        const orderResults = await orderQuery.find();
        setTransactionList(orderResults);
        return true;
      } catch (error) {
        alert(`Error! ${error.message}`);
        return false;
      }
    };
    doQuery();
  }, []);

  // builds the table of customer information
  function getCustomerRow() {
    return userList.map((user, index) => {
      return (
        <tr key={user.get("username")}>
          <td>{user.get("username")}</td>
          <td>{user.get("firstname") + " " + user.get("lastname")}</td>
          <td>
            {user.get("Approved") ? "Approved" : "Unapproved"}
            <button
              onClick={() => {
                approveUser(userList[index]);
              }}
            >
              Approve?
            </button>
          </td>
          <td>{user.get("email")}</td>
          <td>
            <button
              onClick={() => {
                goToMessages(userList[index].get("username"));
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
    return productList.map((product, index) => {
      return (
        <tr key={("product_name", "product_uploader")}>
          <td>{product.get("product_name")}</td>
          <td>{product.get("product_uploader")}</td>
          <td>
            {product.get("Approved") ? "Approved" : "Unapproved"}
            <button
              onClick={() => {
                approveProduct(productList[index]);
              }}
            >
              Approve?
            </button>
          </td>
        </tr>
      );
    });
  }
  function getTransactionRow() {
    console.log(transactionList[0]);
    return transactionList.map((transaction, index) => {
      return (
        <tr key={"product_name"}>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      );
    });
  }
  // function to display users.
  function usersOn() {
    setDisplayProducts(false);
    setDisplayUsers(true);
    setDisplayTransactions(false);
  }

  function producstOn() {
    setDisplayProducts(true);
    setDisplayUsers(false);
    setDisplayTransactions(false);
  }

  function transactionsOn() {
    setDisplayProducts(false);
    setDisplayUsers(false);
    setDisplayTransactions(true);
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
  function goToMessages(username) {
    navigate("/sendmessage", {
      state: { recipient: username },
    });
  }
  return (
    <section id="section_background">
      <HomeBar />
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
