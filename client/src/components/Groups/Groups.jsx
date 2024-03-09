import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Groups() {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ group_name: groupName })
      });

      if (response.ok) {
        // Optionally, you can handle success or redirect to another page
        alert('Group created successfully!');
      } else {
        // Handle non-successful responses
        throw new Error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/groups">Groups</Link></li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>

      {/* Create Group Form */}
      <div>
        <h2>Create Group</h2>
        <form onSubmit={handleCreateGroup}>
          <label>
            Group Name:
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </label>
          <button type="submit">Create Group</button>
        </form>
      </div>
    </div>
  );
}

export default Groups;
