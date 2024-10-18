import { Dispatch, SetStateAction, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

interface IProps {
  onlinePeople: any;
  offlinePeople: any;
  selectedUserId: string | null;
  setSelectedUserId: Dispatch<SetStateAction<string | null>>;
}

function Sidebar({ onlinePeople, offlinePeople, selectedUserId, setSelectedUserId }: IProps) {
  const { id } = useContext(UserContext);
  const [userInput, setUserInput] = useState<string>("");

  return (
    <div className="sidebar">
      <input
        value={userInput}
        type="text"
        placeholder="Enter a name"
        className="input"
        onChange={(event) => setUserInput(event.target.value)}
      />
      {Object.keys(onlinePeople)
        .filter((userId) => userId !== id)
        .filter((userId) => onlinePeople[userId].includes(userInput))
        .map((userId) => (
          <div key={userId} className="user" onClick={() => setSelectedUserId(userId)}>
            <div className="avatar">
              {onlinePeople[userId][0].toUpperCase()}
              <div className="online"></div>
            </div>
            <p className="name">{onlinePeople[userId]}</p>
            {userId === selectedUserId && <div className="selected"></div>}
          </div>
        ))}
      {Object.keys(offlinePeople)
        .filter((userId) => offlinePeople[userId].includes(userInput))
        .map((userId) => (
          <div key={userId} className="user" onClick={() => setSelectedUserId(userId)}>
            <div className="avatar">{offlinePeople[userId][0].toUpperCase()}</div>
            <p className="name">{offlinePeople[userId]}</p>
            {userId === selectedUserId && <div className="selected"></div>}
          </div>
        ))}
    </div>
  );
}

export default Sidebar;
