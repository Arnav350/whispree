import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../context/UserContext";

interface IProps {
  onlinePeople: any;
  offlinePeople: any;
  selectedUserId: string | null;
  setSelectedUserId: Dispatch<SetStateAction<string | null>>;
}

function Sidebar({ onlinePeople, offlinePeople, selectedUserId, setSelectedUserId }: IProps) {
  const { id } = useContext(UserContext);

  return (
    <div className="sidebar">
      {Object.keys(onlinePeople)
        .filter((userId) => userId !== id)
        .map((userId) => (
          <div key={userId} className="user" onClick={() => setSelectedUserId(userId)}>
            <div className="avatar">
              {onlinePeople[userId][0].toUpperCase()}
              <div className="online"></div>
            </div>
            <p className={userId === selectedUserId ? "selected" : ""}>{onlinePeople[userId]}</p>
          </div>
        ))}
      {Object.keys(offlinePeople).map((userId) => (
        <div key={userId} className="user" onClick={() => setSelectedUserId(userId)}>
          <div className="avatar">{offlinePeople[userId][0].toUpperCase()}</div>
          <p className={userId === selectedUserId ? "selected" : ""}>{offlinePeople[userId]}</p>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
