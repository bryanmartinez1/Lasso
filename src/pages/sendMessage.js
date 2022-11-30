import { React, useState, useEffect } from "react";
import Parse from "parse/dist/parse.min.js";

function SendMessage() {
  return (
    <section>
      <h1>Enter a message to send</h1>
      <textarea></textarea>
      <button>Send</button>
    </section>
  );
}

export default SendMessage;
