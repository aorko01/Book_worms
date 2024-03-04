import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar'; // Ensure correct import path

function Friends() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFriendsData();
  }, []);

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
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded">Accept</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Reject</button>
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
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded">Add Friend</button>
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
