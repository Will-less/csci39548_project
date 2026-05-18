import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

const usersUrl = new URL('users', import.meta.env.VITE_API_URL);

function Signup() {
  const navbar = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  //TODO: password needs to be at least 8 characters. Needs to mention UI somewhere
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  //to get test working, add an .env file at /frontend/ with the localhost link with port 3000 and then /api/ 
  useEffect(() => {
    async function grabData() {
      const response = await axios.get(`${usersUrl}/6a0a5a599ca0a11d0d5bdf6d`);
      console.log(response);
    }
    console.log("all vite envs: ", import.meta.env);
    console.log(`${usersUrl}`);
    console.log("vite_api_url: ", import.meta.env.VITE_API_URL);
    grabData();
  }, []);


  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    /*
    console.log(
      "Username:", username,
      "Email:", email,
      "Password:"
    );
    */
    const newUser = { username: username, email: email, password: password };
    const putUser = async () => {
      try {
        await axios.post(`${usersUrl}/register`, newUser);
        console.log('Success:', newUser);
      } catch (error) {
        console.error('Error: ', error);
      }
    };
    putUser();
    //    navbar("/Login");
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="px-8 py-12 flex flex-col items-center">
        <h1 className="text-center text-5xl font-semibold mb-4">
          Create an Account
        </h1>

        <p className="text-center text-gray-300 text-12 mg-12 ">
          Sign up to save your text pages and access them from any device.
        </p>

        <div className="w-full max-w-md bg-[#111c33] border border-[#3f5f91] rounded-lg p-8 mt-8">
          {error && (
            <div className="mb-6 text-red-500/10 border border-red-400 rounded p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm ">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-1 rounded bg-[#111c33] border border-[#3f5f91] text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-1 rounded bg-[#111c33] border border-[#3f5f91] text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-1 rounded bg-[#111c33] border border-[#3f5f91] text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-1 rounded bg-[#111c33] border border-[#3f5f91] text-white placeholder-gray-400 focus:outline none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => navbar("/Login")}
              className="text-sm text-blue-400 hover:underline">
              Already have an account? Login
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Signup;

