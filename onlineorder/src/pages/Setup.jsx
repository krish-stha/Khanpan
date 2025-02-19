

function Setup() {
    return (
      <div className="setup">
        <div className="header">
          <h1>Change Password</h1>
          </div>

          <div class="update_pass">
          <p>Update your password to keep your account secure</p>
          </div>
        
  
        <div className="setup-card">
          <form className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" className="form-input" />
            </div>
  
            <div className="form-group">
              <label>New Password</label>
              <input type="password" className="form-input" />
            </div>
  
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" className="form-input" />
            </div>
  
            <button type="submit" className="update-btn">
              Update Password
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  export default Setup
  
  