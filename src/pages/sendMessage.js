import { React, useState, useEffect } from "react";
import Parse from "parse/dist/parse.min.js";
import { useLocation } from "react-router-dom";
import HomeBar from "../components/homebar";
import "../styles/sendMessages.css";

const Messages = Parse.Object.extend("Messages");

function SendMessage() {
  const location = useLocation();
  const data = location.state;
  console.log(data);
  function charCount() {
    const textarea = document.getElementById("messagetext");
    var length = textarea.value.length;
    document.getElementById("textCountShow").innerHTML = length.toString();
  }

  const createMessage = async function () {
    const curr = await Parse.User.current();
    const text = document.getElementById("messagetext");
    const topic = document.getElementById("topicline");
    console.log("text:", text);
    console.log("topic:", topic);
    try {
      const message = new Messages();
      message.set("recipient", data.recipient);
      message.set("sender", curr.get("username"));
      message.set("content", text.value);
      message.set("topicline", topic.value);
      message.save();
      alert("Message was sent successfully");
      return true;
    } catch (error) {
      alert("Error:" + error.message);
    }
  };

  return (
    <section id="section_background">
      <HomeBar />
      <div id="page">
        <div id="roundedCorner">
          <h1>Topic Line</h1>
          <input
            type="text"
            id="topicline"
            placeholder="Topic"
            maxLength="30"
            defaultValue={data.topic}
          ></input>
        </div>
        <div id="roundedCorner">
          <h1>Enter Message</h1>
          <textarea
            id="messagetext"
            placeholder="Enter Message"
            maxLength="1000"
            onKeyUp={charCount}
          ></textarea>
          <div id="wordCountSection">
            <div id="textCountShow"></div>
            <div>/1000 Characters</div>
          </div>
        </div>
        <button onClick={createMessage}>Send</button>
      </div>
    </section>
  );
}

export default SendMessage;
