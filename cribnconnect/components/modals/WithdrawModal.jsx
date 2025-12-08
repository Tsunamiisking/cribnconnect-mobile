import { Colors } from "@/constants/Colors";
import { AlertCircle } from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const WithdrawModal = ({
  visible,
  onClose,
  balance,
  withdrawAmount,
  setWithdrawAmount,
  onWithdraw,
  isWithdrawing,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={onClose}
          onPressIn={(e) => e.stopPropagation()}
        />
        <View style={styles.withdrawModalContainer}>
          <View style={styles.withdrawModalHeader}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.withdrawModalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>
                ₦
                {((balance || 0) / 100).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>Amount to Withdraw</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount (minimum ₦1,000)"
                placeholderTextColor="#B0B0B0"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.withdrawInfo}>
              <AlertCircle size={16} color={Colors.gray600} />
              <Text style={styles.withdrawInfoText}>
                Withdrawals are processed within 24-48 hours to your registered
                bank account
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, isWithdrawing && styles.buttonDisabled]}
              onPress={onWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Confirm Withdrawal</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  withdrawModalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "90%",
  },
  withdrawModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: Colors.primary,
    fontFamily: "Sora-Medium",
    fontSize: 16,
  },
  withdrawModalContent: {
    padding: 18,
  },
  balanceInfo: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: "Sora-Bold",
    color: Colors.primary,
    marginTop: 4,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
  },
  input: {
    width: "100%",
    height: Platform.OS === "ios" ? 50 : 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    color: Colors.primary,
    marginTop: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Sora-Regular",
  },
  withdrawInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  withdrawInfoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    lineHeight: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default WithdrawModal;
