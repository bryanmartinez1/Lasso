import { React, useState, useEffect } from "react";
import NavBar from "./../components/NavBar.js";
import Parse from "parse/dist/parse.min.js";

function Admin() {
  const [userList, setUserList] = useState();

  useEffect(() => {
    const doQuery = async function () {
      const parseQuery = new Parse.Query("User");
      try {
        const queryResults = await parseQuery.find();
        setUserList(queryResults);
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
          <td>{user.get("Approved") ? "Approved" : "Unapproved"}</td>
          <td>{user.get("email")}</td>
        </tr>
      );
    });
  }

  console.log(userList[0].attributes);

  return (
    <section>
      <NavBar />
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Approved?</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  );
}

export default Admin;
