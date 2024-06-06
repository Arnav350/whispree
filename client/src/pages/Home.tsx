import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../context/UserContext";

function Home() {
  const { id } = useContext(UserContext);

  const [ws, setWs] = useState<null | WebSocket>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>({});
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  const uniqueMessages = useMemo(
    () => Array.from(new Map(messages.map((message) => [message.id, message])).values()),
    [messages]
  );

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

  function handleMessage(event: MessageEvent<any>) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ws?.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      })
    );
    setMessages((prev) => [...prev, { text: newMessage, sender: id, recipient: selectedUserId, id: Date.now() }]);
    setNewMessage("");
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
        {selectedUserId ? (
          <div className="right">
            <div className="log">
              {uniqueMessages.map((message, i) => (
                <div key={i} className={"message" + (message.sender === id ? " my" : "")}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="box" onSubmit={sendMessage}>
              <input
                value={newMessage}
                type="text"
                placeholder="Type a message..."
                className="input"
                onChange={(event) => setNewMessage(event.target.value)}
              />
              <button type="submit" className="send">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="right">
            <p>Select a user</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
