import { Colors } from "@/constants/Colors";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function JoinCodeModal({
  visible,
  onClose,
  joinCode,
  onJoinCodeChange,
  joinError,
  onSubmit,
  isLoading = false,
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
              <Text style={styles.modalTitle}>Enter Join Code</Text>
              <Text style={styles.modalSubtitle}>
                Enter the 6-digit code you received from the group admin.
              </Text>

              {joinError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{joinError}</Text>
                </View>
              )}

              <TextInput
                style={styles.codeInput}
                placeholder="000000"
                placeholderTextColor={Colors.gray400}
                value={joinCode}
                onChangeText={onJoinCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    (joinCode.length !== 6 || isLoading) && styles.disabledButton
                  ]}
                  onPress={onSubmit}
                  disabled={joinCode.length !== 6 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator size="small" color={Colors.white} />
                      <Text style={styles.confirmButtonText}>Joining...</Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.confirmButtonText,
                        joinCode.length !== 6 && styles.disabledButtonText,
                      ]}
                    >
                      Verify & Join
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
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
  codeInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    padding: 16,
    fontFamily: "Sora-Bold",
    fontSize: 24,
    color: Colors.gray900,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 20,
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmButtonText: {
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
  disabledButtonText: {
    opacity: 0.5,
  },
});
