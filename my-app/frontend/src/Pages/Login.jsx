import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AuthContext } from '../Components/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navbar = useNavigate()
  const {login} = useContext(AuthContext);

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    //lets call the backend and see if the user exists
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
      const token = response.data.token;
      login(token);
      navbar("/Library");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        console.error("login error: ", error.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="px-8 py-12 flex flex-col items-center">
        <h1 className="text-center text-5xl font-semibold mb-4">
          Welcome Back
        </h1>

        <p className="text-center text-gray-300 text-12 mg-12 ">
          Please enter your credentials to access the library.
        </p>
        <div className="w-full max-w-md bg-[#111c33] border border-[#3f5f91] rounded-lg p-8 mt-8">
          {error && (
            <div className="mb-6 text-red-500/10 border border-red-400 rounded p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

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

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => navbar("/Signup")}
              className="text-sm text-blue-400 hover:underline">
              Not have an account? Signup
            </button>
          </div>
        </div>
      </main>

    </div>
  )



}

export default Login
