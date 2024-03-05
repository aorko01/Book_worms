import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar'; // Ensure correct import path

function Friends() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Step 1: Add a new state hook for allUsers

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const response = await fetch('http://localhost:3000/friends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setFriendRequests(data.friendRequests);
        setSuggestions(data.suggestions);
        setAllUsers(data.allUsers); // Step 2: Set the allUsers state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFriendsData();
  }, []);

  // Handler for accepting friend requests
  // Handler for accepting friend requests
  const handleAcceptFriendRequest = async (from_id) => {
    try {
      const response = await fetch('http://localhost:3000/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for credentials in cookies
        body: JSON.stringify({ from_id }), // Ensure property name matches the backend expectation
      });
  
      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }
  
      // Refresh the page after successful friend request acceptance
      window.location.reload();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (from_id) => {
    try {
      const response = await fetch('http://localhost:3000/reject-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for credentials in cookies
        body: JSON.stringify({ from_id }), // Ensure property name matches the backend expectation
      });
  
      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }
  
      // Refresh the page after successful friend request acceptance
      window.location.reload();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  const handleSendFriendRequest = async (toUserId) => {
    try {
      const response = await fetch('http://localhost:3000/send-request', { // Replace 'your-endpoint' with the correct path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ to_id: toUserId }), // 
      });
  
      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }
  
      const responseData = await response.json();
      alert(responseData.message); // Or handle this in a more user-friendly way
      window.location.reload(); // Or update state to reflect the change without reloading
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <NavigationBar />
      <div className="w-full">
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-4xl font-semibold mb-4">Friend Requests</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {friendRequests.map((request) => (
                <div key={request.user_id} className="flex flex-col items-center bg-gray-700 rounded-lg shadow p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
                    <img src={request.avatar || 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg'} alt="Profile" className="object-cover rounded-full" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold text-white text-xl">{request.first_name} {request.last_name}</p>
                  </div>
                  <div className="mt-5 flex gap-2">
                  <button 
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleAcceptFriendRequest(request.user_id)} // Call the handler with the requestor's ID
                  >Accept</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleRejectFriendRequest(request.user_id)}
                    >Reject</button>
                  </div>
                </div>
              ))}
              
            </div>
            {/* Border separating Friend Requests and Suggestions */}
            <div className="border-b border-gray-700 my-8"></div>
            <h2 className="text-4xl font-semibold mb-4">Suggestions</h2>
            <div className="grid grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.user_id} className="flex flex-col items-center bg-gray-700 rounded-lg shadow p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
                    <img src={suggestion.avatar || 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg'} alt="Profile" className="object-cover rounded-full" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold text-white text-xl">{suggestion.first_name} {suggestion.last_name}</p>
                  </div>
                  <div className="mt-5 flex gap-2 ">
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                     onClick={() => handleSendFriendRequest(suggestion.user_id)}
                    >Add Friend</button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              {allUsers.map((user) => (
                <div key={user.user_id} className="flex flex-col items-center bg-gray-700 rounded-lg shadow p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full flex items-center justify-center bg-gray-700 rounded-lg overflow-hidden">
                    <img src={user.avatar || 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg'} alt="Profile" className="object-cover rounded-full" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold text-white text-xl">{user.first_name} {user.last_name}</p>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                     onClick={() => handleSendFriendRequest(user.user_id)}
                    >Add Friend</button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 pl-4 border-l border-gray-700 mt-32">
        <h2 className="text-4xl font-semibold mb-6">Chat List</h2>
        {/* Add your chat list component here */}
      </div>
    </div>
  );
}

export default Friends;
