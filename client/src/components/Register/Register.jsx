import React, { useState } from 'react';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '', // Adjust variable names to match the server
    last_name: '', // Adjust variable names to match the server
    email_address: '', // Adjust variable names to match the server
    password: '' // Adjust variable names to match the server
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); 
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const parseRes = await response.json();
      console.log(parseRes);
      localStorage.setItem('token', parseRes.token);

    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">User Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">First Name:</label>
            <input type="text" id="firstName" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200" />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">Last Name:</label>
            <input type="text" id="lastName" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email:</label>
            <input type="email" id="email" name="email_address" value={formData.email_address} onChange={handleChange} className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200" />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Register</button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
