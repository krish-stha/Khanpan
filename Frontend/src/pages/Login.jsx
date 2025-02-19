import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetStep, setIsResetStep] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [resetPasswordData, setResetPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignup) {
      localStorage.setItem("user", JSON.stringify(formData));
      alert("Account created successfully!");
      setIsSignup(false);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (
        storedUser &&
        storedUser.email === formData.email &&
        storedUser.password === formData.password
      ) {
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
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
          {!isSignup && (
            <button type="button" className="forgot-password-button" onClick={openForgotPassword}>
              Forgot Password?
            </button>
          )}
          <p onClick={toggleForm} className="toggle-link">
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            {!isResetStep ? (
              <>
                <h2>Forgot Password</h2>
                <input type="email" placeholder="Enter your email" value={enteredEmail} onChange={(e) => setEnteredEmail(e.target.value)} />
                <button className="form-button" onClick={handleEmailSubmit}>Submit</button>
                <button className="form-button close-btn" onClick={closeForgotPassword}>Close</button>
              </>
            ) : (
              <>
                <h2>Reset Password</h2>
                <input type="password" name="password" placeholder="New Password" value={resetPasswordData.password} onChange={handleResetChange} />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={resetPasswordData.confirmPassword} onChange={handleResetChange} />
                <button className="form-button" onClick={handleResetSubmit}>Reset</button>
                <button className="form-button close-btn" onClick={closeForgotPassword}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
