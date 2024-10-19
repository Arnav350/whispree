import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

interface IProps {
  ws: WebSocket | null;
  selectedUserId: string | null;
  messages: any[];
  setMessages: Dispatch<SetStateAction<any[]>>;
  bottomRef: React.RefObject<HTMLDivElement>;
}

function Chat({ ws, selectedUserId, messages, setMessages, bottomRef }: IProps) {
  const { id } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState<string>("");

  const uniqueMessages = useMemo(
    () => Array.from(new Map(messages.map((message) => [message._id, message])).values()),
    [messages]
  );

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  function sendMessage(event: React.FormEvent<HTMLFormElement> | null, file: any = null) {
    if (event) {
      event.preventDefault();
    }
    if (newMessage.trim() === "" && file == null) {
      return;
    }

    ws?.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    } else {
      setMessages((prev) => [...prev, { text: newMessage, sender: id, recipient: selectedUserId, _id: Date.now() }]);
      setNewMessage("");
    }

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function sendFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      sendMessage(null, {
        name: file.name,
        data: reader.result,
      });
    };
  }

  return (
    <div className="chat">
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
      <form className="new" onSubmit={sendMessage}>
        <div className="box">
          <label className="file">
            <input type="file" className="choose" onChange={sendFile} />+
          </label>
          <input
            value={newMessage}
            type="text"
            placeholder="Type a message..."
            className="input"
            onChange={(event) => setNewMessage(event.target.value)}
          />
        </div>
        <button type="submit" className="send">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
