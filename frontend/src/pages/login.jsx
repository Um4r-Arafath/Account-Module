import "../styles/loginstyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      if (response.data.message === 'Login successful') {
        window.location.href = '/dashboard/home';
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const generateBubbles = (count) => {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      bubbles.push(<div key={i} className="circle-animation"></div>);
    }
    return bubbles;
  };

  useEffect(() => {
    const numBubbles = 20;

    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement("div");
      bubble.className = "circle-animation";
      bubble.style.top = `${Math.random() * 100}vh`;
      bubble.style.left = `${Math.random() * 100}vw`;
      document.body.appendChild(bubble);
    }
  }, []);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid container-style" >
      <ToastContainer />
      <div className="image-overlay"></div>

      <div className="col-md-6 login-form w-25 card-style">

        <form className="p-4" onSubmit={handleLogin}>

          <h3 className="pb-3">
            <FaUserShield className="icon-login" />
            <b className="p-2 letter-login">SIGNIN</b>
          </h3>

          <div className="form-group">
            <input type="text" required className="form-control mb-3" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div className="form-group password-input">
            <input
              required
              type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {/* Show/Hide password button */}
            <button
              type="button"
              className="password-toggle-btn"
              onClick={handlePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="btn btn-outline-light ">Signin</button>

        </form>

      </div>

      {generateBubbles(10)}
    </div>
  );
}

export default Login;