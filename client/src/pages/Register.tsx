import React from "react";
import "../App.css";

function Register() {
  return (
    <div className="register">
      <div className="box">
        <form>
          <h1>Register</h1>
          <div>
            <input type="text" placeholder="Username" required className="input" />
          </div>
          <div>
            <input type="password" placeholder="Password" required className="input" />
          </div>
          <input type="submit" className="button" />
        </form>
      </div>
    </div>
  );
}

export default Register;
