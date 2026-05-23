import { NavLink } from "react-router-dom";
import { useState } from "react";

import { useContext } from "react";
import { AuthContext } from "./AuthContext";


const Navbar = () => {

  //needs context to deal with changes from user log in
  const { isLoggedIn, logout } = useContext(AuthContext);
  // console.log("TOKEN:", localStorage.getItem("userToken"));
  // console.log("Navbar isLoggedIn:", isLoggedIn);
  return (
    <nav className="bg-[#1c2641] text-white py-6 px-8">
      <div className="flex flex-wrap px-4 justify-between items-center max-w-6xl mx-auto text-sm">
        <p className="text-3xl sm:text-4xl font-bold">Texthooker</p>
        <ul className="flex flex-wrap gap-6 text-sm sm:text-base">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/Library">Library</NavLink>
          <NavLink to="/Texthooker">Extract</NavLink>
          {/*Show when the user is logged out */}
          {!isLoggedIn && (
            <>
              <NavLink to="/Login">Login</NavLink>
              <NavLink to="/Signup">Signup</NavLink></>
          )}

          {/*Show when the user is logged in */}
          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
              }}
              className="hover:text-gray-300"
            >
              Logout
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
