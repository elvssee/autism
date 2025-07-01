import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function CommunityChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        sender: auth.currentUser.displayName,
        timestamp: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Community Chat</h2>
      
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="chat-input"
      />
      <button onClick={sendMessage} className="chat-button">Send</button>

      <button className="logout-button" onClick={() => {
        signOut(auth);
        navigate("/");
      }}>Logout</button>
    </div>
  );
}

export default CommunityChat;
