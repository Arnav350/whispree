import React, { useState } from "react";
import "../App.css";

const users = ["Alice", "Bob", "Charlie", "David"];
const messages = {
  Alice: [
    { user: "Alice", text: "Hello everyone!" },
    { user: "You", text: "Hi Alice!" },
  ],
  Bob: [
    { user: "Bob", text: "Hey there!" },
    { user: "You", text: "Hi Bob!" },
  ],
  Charlie: [
    { user: "Charlie", text: "Good morning!" },
    { user: "You", text: "Morning Charlie!" },
  ],
  David: [
    { user: "David", text: "How's it going?" },
    { user: "You", text: "Great David, you?" },
  ],
};

function Home() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleUserClick = (user: string) => {
    setSelectedUser(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="home">
      <div className="chatContainer">
        <div className="userList">
          <h2>Users</h2>
          <ul>
            {users.map((user, index) => (
              <li
                key={index}
                className={selectedUser === user ? "selectedUser" : ""}
                onClick={() => handleUserClick(user)}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="chatBox">
          <div className="chatLog">
            {messages.Alice.map((message, index) => (
              <div key={index} className="message">
                <strong>{message.user}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div className="chatInput">
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={handleInputChange} />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
