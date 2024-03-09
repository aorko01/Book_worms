import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";

function Chatlist() {
  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchChatList() {
      try {
        const response = await fetch("http://localhost:3000/getchatlist", {
          method: "GET",
          credentials: "include", // Include credentials such as cookies
        });
        if (!response.ok) {
          throw new Error("Failed to fetch chat list");
        }
        const data = await response.json();
        setChatList(data);
      } catch (error) {
        console.error(error.message);
        // Handle error
      }
    }

    fetchChatList();

    // Cleanup function for useEffect
  }, []); // Empty dependency array to run effect only once

  const handleChatItemClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="text-white p-4 rounded-lg">
      <h2 className="text-4xl font-semibold mb-4">Chatlist</h2>
      <ul>
        {chatList.map((user) => (
          <li
            key={user.user_id}
            className="flex items-left justify-between py-1 cursor-pointer"
            onClick={() => handleChatItemClick(user)}
          >
            <div className="border border-sky-300 rounded-full w-full p-4 hover:bg-gray-700 flex items-center">
              <img
                src="https://cdn4.vectorstock.com/i/1000x1000/06/18/male-avatar-profile-picture-vector-10210618.jpg"
                alt={`${user.first_name} ${user.last_name}`}
                className="rounded-full h-8 w-8 mr-2"
              />
              <div className="text-lg truncate whitespace-nowrap">
                {user.first_name} {user.last_name}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <ChatWindow
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default Chatlist;
