import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import AP from "../assets/ap.png";

interface IProps {
  setWs: Dispatch<SetStateAction<null | WebSocket>>;
}

function Header({ setWs }: IProps) {
  const { username, setUsername, setId } = useContext(UserContext);

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  return (
    <div className="header">
      <div className="logo">
        <img src={AP} className="ap" />
        <h2 className="title">Whispree</h2>
      </div>
      <div className="user">
        <div className="avatar">{username && username[0].toUpperCase()}</div>
        <h4 className="name">{username}</h4>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
