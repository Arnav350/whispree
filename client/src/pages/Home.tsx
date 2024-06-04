import { useEffect, useState } from "react";

function Home() {
  const [ws, setWs] = useState<null | WebSocket>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>({});

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
        <div className="list">
          <h2>Users</h2>
          {Object.keys(onlinePeople).map((userId) => (
            <div key={userId}>{onlinePeople[userId]}</div>
          ))}
        </div>
        <div className="right">
          <div className="log">
            <p>message...</p>
          </div>
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
