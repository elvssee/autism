import React, { useState } from "react";
import "./Chatbot.css"; // Import styles

const Chatbot = () => {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! Ask me anything about ASD or type 'start test' to begin the questionnaire." }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    if (input.toLowerCase() === "start test") {
      setMessages([...messages, newMessage, { sender: "bot", text: "Let's start! First question: Does your child respond to their name when called?" }]);
    } else {
      // Send message to ChatGPT API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "system", content: "You are an autism support chatbot." }, { role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      setMessages([...messages, newMessage, { sender: "bot", text: botResponse }]);
    }
    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
