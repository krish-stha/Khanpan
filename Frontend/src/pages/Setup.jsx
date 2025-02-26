import React, { useState, useEffect } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

function Setup() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch current user details using the /me endpoint.
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic validations
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New Password and Confirm New Password do not match.");
      return;
    }

    if (!user || !user.id) {
      setError("User not found.");
      return;
    }

    try {
      // Send PUT request to update password.
      await axiosInstance.put(`/users/${user?.id}`, {
        // We are only sending the new password.
        // (Note: Your backend update function does not currently verify the current password.)
        password: newPassword,
      });
      setMessage("Password updated successfully!");
      // Optionally, clear form fields after successful update.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password.");
    }
  };

  return (
    <div className="setup">
      <div className="header">
        <h1>Change Password</h1>
      </div>

      <div className="update_pass">
        <p>Update your password to keep your account secure</p>
      </div>

      <div className="setup-card">
        <form className="password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="update-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setup;
