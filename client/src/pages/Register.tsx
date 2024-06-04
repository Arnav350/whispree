import React, { useContext, useState } from "react";
import axios from "axios";
import "../App.css";
import { UserContext } from "../context/UserContext";

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registerPage, setRegisterPage] = useState<boolean>(true);
  const { setUsername: setRegisteredUsername, setId } = useContext(UserContext);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = registerPage ? "/register" : "/login";
    const { data } = await axios.post(url, { username, password });
    setRegisteredUsername(username);
    setId(data.id);
  }

  return (
    <div className="register">
      <div className="box">
        <form onSubmit={handleSubmit}>
          {registerPage ? <h1>Register</h1> : <h1>Login</h1>}
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
        {registerPage ? (
          <p className="bottom">
            Already have an account?{" "}
            <button className="here" onClick={() => setRegisterPage(false)}>
              Login here
            </button>
          </p>
        ) : (
          <p className="bottom">
            Don't have an account?{" "}
            <button className="here" onClick={() => setRegisterPage(true)}>
              Register here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
