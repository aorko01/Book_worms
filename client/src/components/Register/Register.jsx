import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies are sent with the request
        body: JSON.stringify(formData),
      });

      // You might check response status or a specific field in the JSON body to confirm registration success
      if (response.ok) {
        navigate('/'); // Redirect to login page after successful registration
      } else {
        const parseRes = await response.json();
        setErrorMessage(parseRes.message || 'Registration was unsuccessful. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
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
        {errorMessage && <div className="mt-4 bg-red-600 text-white p-2 rounded-lg">{errorMessage}</div>}
      </div>
    </div>

  );
};

export default UserRegistration;
