import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await axios.post("/register", { username, password });
  }

  return (
    <div className="register">
      <div className="box">
        <form onSubmit={registerUser}>
          <h1>Register</h1>
          <div>
            <input
              value={username}
              type="text"
              placeholder="Username"
              required
              className="input"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <input
              value={password}
              type="password"
              placeholder="Password"
              required
              className="input"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <input type="submit" className="button" />
        </form>
      </div>
    </div>
  );
}

export default Register;
