import React from "react";
import axios from "axios";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;
  // return <Home />;
  return <Register />;
}

export default App;
