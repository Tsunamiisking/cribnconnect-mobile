import { Colors } from "@/constants/Colors";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function JoinConfirmationModal({
  visible,
  onClose,
  linkup,
  isPrivate,
  requestMessage,
  onRequestMessageChange,
  requestSent,
  joinError,
  onSubmitRequest,
  onConfirmPublicJoin,
  onEnterCode,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              {isPrivate ? (
                // Private group - request form
                <>
                  <Text style={styles.modalTitle}>Request to Join</Text>
                  <Text style={styles.modalSubtitle}>
                    This is a private group. Send a request to the group admin.
                  </Text>

                  {joinError && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{joinError}</Text>
                    </View>
                  )}

                  {requestSent ? (
                    <View style={styles.successContainer}>
                      <Text style={styles.successText}>
                        ✓ Request sent successfully!
                      </Text>
                      <Text style={styles.successSubtext}>
                        You'll receive a join code when approved.
                      </Text>
                    </View>
                  ) : (
                    <>
                      <TextInput
                        style={styles.requestInput}
                        placeholder="Why would you like to join? (Optional)"
                        placeholderTextColor={Colors.gray400}
                        value={requestMessage}
                        onChangeText={onRequestMessageChange}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />

                      <View style={styles.modalButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={onClose}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={onSubmitRequest}
                        >
                          <Text style={styles.sendButtonText}>
                            Send Request
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.codeEntryLink}
                        onPress={() => {
                          onClose();
                          onEnterCode();
                        }}
                      >
                        <Text style={styles.codeEntryLinkText}>
                          Already have a code? Enter it here
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                // Public group - confirmation
                <>
                  <Text style={styles.modalTitle}>
                    Join "{linkup?.title}"?
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    You're about to join this public group. Please be respectful
                    and follow the group guidelines.
                  </Text>

                  {joinError && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{joinError}</Text>
                    </View>
                  )}

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={onClose}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={onConfirmPublicJoin}
                    >
                      <Text style={styles.confirmButtonText}>Join Group</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Urbanist-Bold",
    color: Colors.gray900,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  requestInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    padding: 12,
    fontFamily: "Sora-Regular",
    fontSize: 15,
    color: Colors.gray900,
    minHeight: 100,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray100,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.gray700,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  sendButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: "#fee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontFamily: "Sora-Regular",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "#efe",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  successText: {
    color: "#059669",
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    marginBottom: 4,
  },
  successSubtext: {
    color: "#047857",
    fontFamily: "Sora-Regular",
    fontSize: 14,
  },
  codeEntryLink: {
    marginTop: 12,
    alignItems: "center",
  },
  codeEntryLinkText: {
    color: Colors.primary,
    fontFamily: "Sora-Medium",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
