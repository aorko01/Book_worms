import React, { useState, useEffect } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typedIntroText, setTypedIntroText] = useState('');
  const [typedLoremText, setTypedLoremText] = useState('');
  const introTextToType = " Good Day!"; // Text to type out
  const loremTextToType = "H appiness and Books are worth sharing..."; // Lorem Ipsum text

  useEffect(() => {
    let index = 0;
    const intervalIntro = setInterval(() => {
      if (index < introTextToType.length) {
        setTypedIntroText((prevTypedText) => prevTypedText + introTextToType.charAt(index));
        index++;
      } else {
        clearInterval(intervalIntro);
      }
    }, 100); // Typing speed (adjust as needed)

    return () => clearInterval(intervalIntro);
  }, []);

  useEffect(() => {
    let index = 0;
    const intervalLorem = setInterval(() => {
      if (index < loremTextToType.length) {
        setTypedLoremText((prevTypedText) => prevTypedText + loremTextToType.charAt(index));
        index++;
      } else {
        clearInterval(intervalLorem);
      }
    }, 50); // Typing speed (adjust as needed)

    return () => clearInterval(intervalLorem);
  }, []);

  const handleLogin = () => {
    // Add your login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleRegister = () => {
    // Add your register logic here
    console.log('Redirect to registration page');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-1/2 mr-16">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-xl mb-4">{typedIntroText}</p>
        <p className="text-lg">{typedLoremText}</p>
      </div>
      <div className="bg-gray-700 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-mono font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="bg-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="bg-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 
            rounded-xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-gray-500 rounded-xl hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
