import React, { useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;
  const { username, id } = useContext(UserContext);

  if (username) {
    return <h1>Logged In {username}</h1>;
  }

  return <Register />;
}

export default App;
