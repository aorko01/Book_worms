import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Bookinfo from "./components/BookInfo/Bookinfo";
import Friends from "./components/Friends/Friends";
import Groups from "./components/Groups/Groups";
import AddBook from "./components/AddBook/AddBook";
import Profile from "./components/Profile/Profile";
import Search from "./components/Search/Search";
import IndividualBook from "./components/IndividualBook/IndividualBook";
const App = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<Bookinfo />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/individual-book/:bookId" element={<IndividualBook />} />
      </Routes>
    </Router>
  );
};

export default App;
