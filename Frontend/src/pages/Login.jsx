import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetStep, setIsResetStep] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate()

  const [errors, setErrors] = useState({});

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const openForgotPassword = () => {
    setIsForgotPasswordOpen(true);
    setErrors({});
    setForgotPasswordData({ email: "", password: "", confirmPassword: "" });
    setIsResetStep(false);
  };

  const closeForgotPassword = () => setIsForgotPasswordOpen(false);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleForgotPasswordChange = (e) =>
    setForgotPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (isSignup && !formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (isSignup && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSignup) {
      localStorage.setItem("user", JSON.stringify(formData));
      alert("Account created successfully!");
      setIsSignup(false);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
        alert("Login successful!");
        navigate("/dashboard")
        
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
              {errors.fullName && <p className="error-text">{errors.fullName}</p>}
            </div>
          )}
          <div className="input-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="input-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          {isSignup && (
            <div className="input-group">
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>
          )}
          <button type="submit" className="form-button">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <div className="footer-links">
          {!isSignup && (
            <button type="button" className="forgot-password-button" onClick={openForgotPassword}>Forgot Password?</button>
          )}
          <p onClick={toggleForm} className="toggle-link">{isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}</p>
        </div>
      </div>
      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Forgot Password</h2>
            <form>
              <input type="email" placeholder="Enter your email" value={forgotPasswordData.email} onChange={handleForgotPasswordChange} />
              <button type="button" className="form-button" onClick={closeForgotPassword}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;