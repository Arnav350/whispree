import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

function Home() {
  const { id } = useContext(UserContext);

  const [ws, setWs] = useState<null | WebSocket>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>({});
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:4000");
    setWs(websocket);
    websocket.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleArr: any[]) {
    const people: any = {};
    peopleArr.forEach(({ userId, username }: any) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(event: any) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }

  return (
    <div className="home">
      <div className="container">
        <div className="users">
          <h2>Users</h2>
          {Object.keys(onlinePeople)
            .filter((userId) => userId !== id)
            .map((userId) => (
              <div key={userId} className="user" onClick={() => setSelectedUserId(userId)}>
                <div className="avatar">{onlinePeople[userId][0].toUpperCase()}</div>
                <p className={userId === selectedUserId ? "selected" : ""}>{onlinePeople[userId]}</p>
              </div>
            ))}
        </div>
        <div className="right">
          <div className="log">{!selectedUserId && <p>Select a user</p>}</div>
          <div className="box">
            <input type="text" placeholder="Type a message..." className="input" />
            <button className="send">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
