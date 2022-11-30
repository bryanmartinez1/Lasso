import { React, useState, useEffect } from "react";
import Parse from "parse/dist/parse.min.js";
import { useLocation } from "react-router-dom";

const Messages = Parse.Object.extend("Messages");

function SendMessage() {
  const location = useLocation();
  const data = location.state;

  const createMessage = async function () {
    const text = document.getElementById("messagetext");
    try {
      const message = new Messages();
      message.set("recipient", data.recipient);
      message.set("sender", "testing");
      message.set("content", text.value);
      message.save();
      return true;
    } catch (error) {
      alert("Error:" + error.message);
    }
  };

  return (
    <section>
      <h1>Enter a message to send</h1>
      <textarea id="messagetext"></textarea>
      <button onClick={createMessage}>Send</button>
    </section>
  );
}

export default SendMessage;
