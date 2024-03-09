import React, { useState, useEffect } from "react";

function ChatWindow({ selectedUser, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(selectedUser.user_id);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getmessages?to_id=${selectedUser.user_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const messages = await response.json(); // Get the messages directly
          setMessages(messages); // Set messages state
          console.log(messages);
          console.log("reached get message");
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  // Function to handle sending a message
  const sendMessage = async () => {
    // Code for sending a message...
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div>{`${selectedUser.first_name} ${selectedUser.last_name}`}</div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="h-40 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.message_id}>{message.message}</div>
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
