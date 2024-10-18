import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import AP from "../assets/ap.png";

interface IProps {
  logout: () => void;
}

function Header({ logout }: IProps) {
  const { username } = useContext(UserContext);

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
