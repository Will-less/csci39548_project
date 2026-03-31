import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {

  //needs context to deal with changes from user log in
  return (
    <nav>
      <ul className="flex space-x-4 content-between">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/Texthooker">Texthooker</NavLink>
        </li>
        <li>
          <NavLink to="/Login">Login</NavLink>
        </li>
        <li>
          <NavLink to="Library">Library</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
