// ./components/users/UserMessagesWeb.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";

import { FirebaseFirestoreService } from "../../services/firestore/FirebaseFirestoreService";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import { AuthContext } from "../../contexts/AuthContext";
import Spacer from "../utils/Spacer";

type MessageType = {
  content: string;
  createdAt: Timestamp;
  userId: string;
  senderName: string;
};

type UserMessagesProps = {
  userId: string;
};

const UserMessagesWeb: React.FC<UserMessagesProps> = ({ userId }) => {
  const { globalStyles, themeTextColor } = useGlobalStyles();
  const { userDetails } = useContext(AuthContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const flatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await FirebaseFirestoreService.getUserMessages(
        userId
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await FirebaseFirestoreService.addMessageToUser(userId, {
          content: newMessage,
          userId: userId,
          senderName: userDetails?.displayName || "Anonymous",
        });
        setNewMessage("");
        fetchMessages();
        // Scroll to the bottom when a new message is added
        flatListRef.current?.scrollTo({
          top: flatListRef.current.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p className="textBold" style={{ color: themeTextColor, margin: 0 }}>
        Messages
      </p>
      <div
        ref={flatListRef}
        style={{ flex: 1, overflowY: "auto", width: "80%" }}
      >
        {messages.map((item, index) => (
          <p key={index} style={{ color: themeTextColor }}>
            {item.senderName}: {item.content}
          </p>
        ))}
      </div>
      <div style={{ width: "80%" }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            minHeight: "40px",
            // height: `${inputHeight}px`,
            height: "auto",
            width: "100%",
            color: themeTextColor,
            paddingLeft: "8px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setInputHeight(target.scrollHeight);
          }}
        />
      </div>
      <div
        style={{
          width: "80%",
          justifyContent: "flex-end",
          display: "flex",
          alignContent: "flex-end",
          marginTop: 10,
        }}
      >
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default UserMessagesWeb;
