import { Colors } from "@/constants/Colors";
import { MessageCircle, Send, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const InitiateChatModal = ({ visible, onClose, recipientName, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    if (message.trim().length < 2) {
      Alert.alert("Error", "Message is too short");
      return;
    }

    try {
      setIsSending(true);
      await onSendMessage(message.trim());
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MessageCircle size={24} color={Colors.primary} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Start Conversation</Text>
                <Text style={styles.headerSubtitle}>
                  with {recipientName}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={isSending}
            >
              <X size={24} color={Colors.gray600} />
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Send your first message to start a conversation. {recipientName} will be notified and can choose to accept or ignore your request.
            </Text>
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Message</Text>
            <TextInput
              style={styles.textInput}
              placeholder={`Say hi to ${recipientName}...`}
              placeholderTextColor={Colors.gray400}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
              editable={!isSending}
            />
            <Text style={styles.charCount}>{message.length}/500</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.sendButton,
                (isSending || !message.trim()) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={isSending || !message.trim()}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Send size={18} color={Colors.white} />
                  <Text style={styles.sendButtonText}>Send Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray900,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    backgroundColor: Colors.blue50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Sora-Regular",
    color: Colors.gray900,
    minHeight: 100,
    backgroundColor: Colors.white,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray500,
    textAlign: "right",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.gray100,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 15,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
});

export default InitiateChatModal;
