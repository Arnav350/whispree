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
              <p className="select">Select a user</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
