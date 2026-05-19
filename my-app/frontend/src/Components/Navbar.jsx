import { NavLink } from "react-router-dom";
import { useCallback, useState } from "react";

import {useContext} from "react";
import {AuthContext} from "./AuthContext";


const Navbar = () => {

  //needs context to deal with changes from user log in
  const {isLoggedIn, logout} = useContext(AuthContext);
  return (
    <nav className="bg-[#0f172a] text-white py-6 px-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto text-sm">
        <p className="text-3xl font-semibold">Texthooker</p>
        <ul className="flex gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/Library">Library</NavLink>
            <NavLink to="/Texthooker">Texthooker</NavLink>
            {/*Show when the user is logged out */}
            {!isLoggedIn && (
              <>
                <NavLink to="/Login">Login</NavLink>
                <NavLink to="/Signup">Signup</NavLink></>
            )}

            {/*Show when the user is logged in */}
            {isLoggedIn && (
              <button 
              onClick={logout}
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
