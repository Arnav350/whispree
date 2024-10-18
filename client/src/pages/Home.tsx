import { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function Home() {
  const { id } = useContext(UserContext);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<any>({});
  const [offlinePeople, setOfflinePeople] = useState<any>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  function websocketConnect() {
    const websocket = new WebSocket("ws://localhost:4000");
    setWs(websocket);
    websocket.addEventListener("message", handleMessage);
    websocket.addEventListener("close", () => setTimeout(() => websocketConnect(), 200));
  }

  useEffect(() => {
    websocketConnect();
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const peopleArr = res.data
        .filter((person: any) => person._id !== id)
        .filter((person: any) => !Object.keys(onlinePeople).includes(person._id));
      const people: any = {};
      peopleArr.forEach(({ _id, username }: any) => {
        people[_id] = username;
      });
      setOfflinePeople(people);
    });
  }, [onlinePeople, id]);

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
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }

  return (
    <div className="home">
      <div className="container">
        <Header setWs={setWs} />
        <div className="main">
          <Sidebar
            onlinePeople={onlinePeople}
            offlinePeople={offlinePeople}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
          {selectedUserId ? (
            <Chat
              ws={ws}
              selectedUserId={selectedUserId}
              messages={messages}
              setMessages={setMessages}
              bottomRef={bottomRef}
            />
          ) : (
            <div className="chat">
              <p>Select a user</p>
            </div>
          )}
        </div>
        {/* <div className="left">
          <div className="users">
            <h2>Users</h2>
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
          <div className="bottom">
            <h4 className="username">{username}</h4>
            <button className="logout" onClick={logout}>
              logout
            </button>
          </div>
        </div>
        {selectedUserId ? (
          <div className="right">
            <div className="log">
              {uniqueMessages.map((message) => (
                <div key={message._id} className={"message" + (message.sender === id ? " my" : "")}>
                  {message.text}
                  {message.file && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={axios.defaults.baseURL + "/uploads/" + message.file}
                      className="underline"
                    >
                      {message.file}
                    </a>
                  )}
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>
            <form className="box" onSubmit={sendMessage}>
              <input
                value={newMessage}
                type="text"
                placeholder="Type a message..."
                className="input"
                onChange={(event) => setNewMessage(event.target.value)}
              />
              <label className="file">
                <input type="file" className="choose" onChange={sendFile} />
                File
              </label>
              <button type="submit" className="send">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="right">
            <p>Select a user</p>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Home;
