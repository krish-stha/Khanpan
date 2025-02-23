import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Regex for email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!isValidEmail(formData.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!isValidPassword(formData.password)) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      if (isSignup) {
        // Signup logic
        const response = await axios.post("http://localhost:4000/api/users", {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        console.log(response);
        alert("Account created successfully!");
        setIsSignup(false);
      } else {
        // Login logic
        const response = await axios.post("http://localhost:4000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log(response);
        const accessToken = response?.data?.data?.access_token ?? null;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          navigate("/dashboard");
        } else {
          alert("Invalid credentials.");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Invalid credentials.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  // Toggle between Login & Signup
  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
  };

  // Open Forgot Password Modal
  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setEnteredEmail("");
    setIsResetStep(false);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
    setIsResetStep(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetChange = (e) => {
    setResetPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Forgot Password Email Submission
  const handleEmailSubmit = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === enteredEmail) {
      setIsResetStep(true);
    } else {
      alert("Email not found!");
    }
  };

  // Handle Password Reset
  const handleResetSubmit = () => {
    if (resetPasswordData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    let storedUser = JSON.parse(localStorage.getItem("user"));
    storedUser.password = resetPasswordData.password;
    localStorage.setItem("user", JSON.stringify(storedUser));
    alert("Password reset successful! Please login.");
    closeForgotPassword();
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
            </div>
          )}
          <div className="input-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          </div>
          {isSignup && (
            <div className="input-group">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
            </div>
          )}
          <button type="submit" className="form-button">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <div className="footer-links">
       
          <p onClick={toggleForm} className="toggle-link">
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default Login;
