import React, { useState } from "react";

function ChatWindow({ selectedUser, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Function to handle sending a message
  const sendMessage = () => {
    // Implement sending message functionality here
    // You can use WebSocket or any other means to send messages
    // After sending, add the message to the messages state
    setMessages([...messages, { sender: "me", message }]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        
        <div>{`${selectedUser.first_name} ${selectedUser.last_name}`}</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="h-40 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "me" ? "text-right" : ""}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border rounded-full p-2 bg-gray-700"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="border rounded-r-lg px-4">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
