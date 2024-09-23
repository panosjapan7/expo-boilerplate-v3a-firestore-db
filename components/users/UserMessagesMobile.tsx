// ./components/users/UserMessagesMobile.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
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

const UserMessagesMobile: React.FC<UserMessagesProps> = ({ userId }) => {
  const { globalStyles, themeTextColor } = useGlobalStyles();
  const { userDetails } = useContext(AuthContext);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const flatListRef = useRef<FlatList>(null);

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
        flatListRef.current?.scrollToEnd({ animated: true });
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <View
      style={{
        justifyContent: "flex-start",
        width: "90%",
        paddingTop: 20,
      }}
    >
      <Text style={[globalStyles.textBold]}>User Messages</Text>
      <Spacer marginTop={10} />
      <View
        style={{
          height: "auto",
          width: "100%",
        }}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={{ color: themeTextColor, marginBottom: 6 }}>
              {item.senderName}: {item.content}
            </Text>
          )}
        />
      </View>
      <Spacer marginTop={20} />
      <View>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={themeTextColor}
          multiline={true}
          onContentSizeChange={(event) => {
            setInputHeight(event.nativeEvent.contentSize.height);
          }}
          style={[
            globalStyles.border,
            {
              minHeight: 40,
              height: inputHeight,
              color: themeTextColor,
              paddingHorizontal: 10,
              paddingVertical: 10,
              //   paddingBottom: 20,
            },
          ]}
        />
      </View>
      <Spacer marginTop={16} />
      <View
        style={{
          width: "auto",
          alignItems: "flex-end",
          paddingRight: 10,
        }}
      >
        <Pressable onPress={handleSendMessage} style={{ marginVertical: 10 }}>
          <Text style={globalStyles.textBlack}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UserMessagesMobile;
