import React from "react";
import "../App.css";

function Register() {
  return (
    <div className="register">
      <div className="register-box">
        <h1>Register</h1>
        <form>
          <div className="textbox">
            <input type="text" placeholder="Username" required />
          </div>
          <div className="textbox">
            <input type="password" placeholder="Password" required />
          </div>
          <input type="submit" className="btn" value="Register" />
        </form>
      </div>
    </div>
  );
}

export default Register;
