import React, { useState } from 'react';
import { Bot } from "lucide-react";

function Chatbot() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <div
        style={{
  position: "fixed",
  bottom: 15,
  right: 15,
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "#007bff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  cursor: "pointer",
  zIndex: 999999,
}}

        onClick={() => setShowChat(!showChat)}
      >
        <Bot size={28} />
      </div>

      {/* Chatbot iframe */}
     {showChat && (
  <iframe
    src="/chat"
    style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      width: window.innerWidth < 768 ? "100%" : 600,
      height: window.innerWidth < 768 ? "100%" : 675,
      border: "none",
      zIndex: 9998,
      background: "white"
    }}
  ></iframe>
)}

    </>
  );
}

export default Chatbot;
