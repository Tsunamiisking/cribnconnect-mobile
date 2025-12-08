import { Colors } from "@/constants/Colors";
import { AlertCircle, CheckCircle, ChevronDown, Wallet } from "lucide-react-native";
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

const CreateWalletModal = ({
  visible,
  onClose,
  bankAccountNumber,
  setBankAccountNumber,
  selectedBank,
  onSelectBank,
  verifiedAccountName,
  isAccountVerified,
  onVerifyAccount,
  isVerifyingBank,
  onCreateWallet,
  isCreatingWallet,
}) => {
  const handleClose = () => {
    console.log("CreateWalletModal closing");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      hardwareAccelerated={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={handleClose}
          onPressIn={(e) => e.stopPropagation()}
        />
        <View style={styles.withdrawModalContainer}>
          <View style={styles.withdrawModalHeader}>
            <Text style={styles.modalTitle}>Create Wallet</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.withdrawModalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.withdrawInfo}>
              <AlertCircle size={16} color={Colors.primary} />
              <Text style={styles.infoTextPrimary}>
                Link your bank account to receive payments and withdraw earnings
              </Text>
            </View>

            {/* Account Number Input */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit account number"
                placeholderTextColor="#B0B0B0"
                value={bankAccountNumber}
                onChangeText={setBankAccountNumber}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Bank Selection */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Select Bank</Text>
              <TouchableOpacity
                style={[styles.input, styles.bankSelector]}
                onPress={onSelectBank}
              >
                <Text
                  style={[
                    styles.bankSelectorText,
                    !selectedBank && styles.placeholderText,
                  ]}
                >
                  {selectedBank ? selectedBank.name : "Select your bank"}
                </Text>
                <ChevronDown size={20} color={Colors.gray600} />
              </TouchableOpacity>
            </View>

            {/* Verified Account Name */}
            {isAccountVerified && verifiedAccountName && (
              <View style={styles.verifiedAccountInfo}>
                <CheckCircle size={20} color="#10b981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifiedLabel}>Account Name</Text>
                  <Text style={styles.verifiedName}>{verifiedAccountName}</Text>
                </View>
              </View>
            )}

            {/* Verify Button */}
            {!isAccountVerified && (
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  isVerifyingBank && styles.buttonDisabled,
                ]}
                onPress={onVerifyAccount}
                disabled={isVerifyingBank || !bankAccountNumber || !selectedBank}
              >
                {isVerifyingBank ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Account</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Create Wallet Button */}
            {isAccountVerified && (
              <TouchableOpacity
                style={[styles.button, isCreatingWallet && styles.buttonDisabled]}
                onPress={onCreateWallet}
                disabled={isCreatingWallet}
              >
                {isCreatingWallet ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Wallet size={20} color="white" />
                    <Text style={styles.buttonText}>Create Wallet</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
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
  infoTextPrimary: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
    lineHeight: 18,
  },
  bankSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bankSelectorText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
    flex: 1,
  },
  placeholderText: {
    color: "#B0B0B0",
  },
  verifiedAccountInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  verifiedLabel: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  verifiedName: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginTop: 2,
  },
  verifyButton: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  verifyButtonText: {
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
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

export default CreateWalletModal;
