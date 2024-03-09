import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import Chatlist from '../Chatlist/Chatlist';
import { useNavigate } from 'react-router-dom';

function Groups() {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:3000/groups', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setGroups(responseData);
    } catch (error) {
      console.error(error.message);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ group_name: groupName })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Refresh groups after creating a new group
      await fetchGroups();

      // Clear group name input field
      setGroupName('');

    } catch (error) {
      console.error(error.message);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  const handleGetGroupClick = (groupId) => {
    // Add your navigation logic here
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <NavigationBar />
      <div className="flex my-10 mx-10 pt-[4rem]">
        {/* Left section */}
        <div className="w-1/5 pr-4">
          <h2 className="text-4xl font-semibold mb-7">Create a New Group</h2>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 mb-4 rounded-lg focus:outline-none focus:bg-gray-600"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Create Group
          </button>
        </div>
        {/* Middle section */}
        <div className="w-3/5 px-4">
          <h2 className="text-4xl font-semibold mb-7">Groups</h2>
          <div className="grid grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center"
                key={group.group_id}
                onClick={() => handleGetGroupClick(group.group_id)}
              >
                <div className="text-xl mb-2">{group.group_name}</div>
                {/* Add additional information about the group if needed */}
              </div>
            ))}
          </div>
        </div>
        {/* Right section */}
        <div className="w-1/5 pl-4 border-l border-gray-700">
          <Chatlist />
        </div>
      </div>
    </div>
  );
}

export default Groups;
