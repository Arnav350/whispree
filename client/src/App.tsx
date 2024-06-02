import React, { useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;
  const { username } = useContext(UserContext);
  return <Register />;
}

export default App;
