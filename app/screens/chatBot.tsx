import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ScrollView
} from "react-native";
import { startGeminiChat, getGeminiChatResponse } from "@/backend/gemini";

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
  jobInfo?: string;
}

const { width, height } = Dimensions.get("window");

const PRESET_MESSAGES = [
  "Understand job requirements",
  "Highlight skills",
  "Mock interview"
];

const ChatbotModal: React.FC<ChatbotModalProps> = ({
  visible,
  onClose,
  jobInfo
}) => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [chat, setChat] = useState<any>(null);

  const [showPresetButtons, setShowPresetButtons] = useState(true);

  const handleSend = async (msg: string = "") => {
    const textToSend = msg || inputText.trim();
    if (!textToSend) return;

    // Hide preset buttons after the first user message
    if (showPresetButtons) {
      setShowPresetButtons(false);
    }

    if (!msg) {
      setInputText("");
    }

    const userMessage = { role: "user", text: textToSend };

    if (!chat) {
      const newChat = await startGeminiChat(jobInfo);
      const modelReply = await getGeminiChatResponse(newChat, textToSend);
      setChat(newChat);
      setMessages((prev) => [...prev, userMessage, { role: "model", text: modelReply }]);
    } else {
      const modelReply = await getGeminiChatResponse(chat, textToSend);
      setMessages((prev) => [...prev, userMessage, { role: "model", text: modelReply }]);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/images/bridge-chat.png")}
              style={styles.image}
            />
            <Text style={styles.title}>Bridget</Text>
            <Text style={styles.subtitle}>
              Prep for interviews whenever and wherever
            </Text>
          </View>
 
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.chatContainer}>
              <Text style={styles.chatText}>
                Alright, you've got a job opportunity in sight—let's make sure you shine!
                I've broken down the role and compared it with your experiences.
              </Text>
              <Text style={styles.chatText}>
                ✅ Understand what this job really needs
              </Text>
              <Text style={styles.chatText}>
                ✅ Highlight your best skills for it
              </Text>
              <Text style={styles.chatText}>
                ✅ Prepare with interview questions that might come up
              </Text>

              {messages.map((message, index) => (
                <View
                  key={index}
                  style={
                    message.role === "user" ? styles.userMessage : styles.chatBubble
                  }
                >
                  <Text
                    style={
                      message.role === "user"
                        ? styles.userMessageText
                        : styles.chatText
                    }
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* 3. Render preset buttons conditionally */}
            {showPresetButtons && (
              <View style={styles.presetButtonsContainer}>
                {PRESET_MESSAGES.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={styles.presetButton}
                    onPress={() => handleSend(preset)}
                  >
                    <Text style={styles.presetButtonText}>{preset}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Input field */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChatbotModal;

// -- Styles --
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: width,
    height: height - 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    top: 30
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15
  },
  closeText: {
    fontSize: 24
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    fontFamily: "Nunito",
    color: "#517FA5"
  },
  subtitle: {
    fontSize: 12,
    color: "#606060",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Nunito"
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15
  },
  chatText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Nunito"
  },
  chatBubble: {
    marginBottom: 5
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#517FA5",
    padding: 8,
    borderRadius: 16,
    marginVertical: 5
  },
  userMessageText: {
    color: "#FFFFFF",
    fontFamily: "Nunito"
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  presetButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10
  },
  presetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#517FA5",
    margin: 5,
    backgroundColor: "#FFF"
  },
  presetButtonText: {
    color: "#517FA5",
    fontFamily: "Nunito",
    fontSize: 14
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20
  },
  input: {
    backgroundColor: "#E6E6E6",
    flex: 1,
    height: 38,
    fontFamily: "Nunito",
    borderRadius: 20,
    paddingHorizontal: 12
  },
  sendButton: {
    backgroundColor: "#517FA5",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito"
  }
});
