import { Colors } from "@/constants/Colors";
import { AlertCircle, CreditCard, Wallet } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WalletDisplay = ({
  paystackSubAccount,
  onWithdraw,
  onCreate,
  withdrawDisabled = false,
}) => {
  // Check if wallet exists and has complete data
  const hasWallet =
    paystackSubAccount &&
    paystackSubAccount.accountNumber &&
    paystackSubAccount.accountName;

  if (!hasWallet) {
    return (
      <View style={styles.container}>
        <View style={styles.walletHeader}>
          <Wallet size={24} color={Colors.primary} />
          <Text style={styles.walletTitle}>Paystack Wallet</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Manage your earnings and withdrawals
        </Text>

        <View style={styles.noWalletCard}>
          <AlertCircle size={48} color={Colors.gray600} />
          <Text style={styles.noWalletTitle}>No Wallet Yet</Text>
          <Text style={styles.noWalletDescription}>
            Create a Paystack wallet to receive payments and manage your
            earnings
          </Text>
          <TouchableOpacity
            style={styles.createWalletButton}
            onPress={onCreate}
          >
            <Wallet size={20} color="white" />
            <Text style={styles.createWalletButtonText}>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const balance = (paystackSubAccount.balance || 0) / 100; // Convert from kobo to naira
  const canWithdraw = balance >= 1000; // Minimum ₦1,000

  return (
    <View style={styles.container}>
      <View style={styles.walletHeader}>
        <Wallet size={24} color={Colors.primary} />
        <Text style={styles.walletTitle}>Paystack Wallet</Text>
      </View>
      <Text style={styles.sectionDescription}>
        Manage your earnings and withdrawals
      </Text>

      <View style={styles.walletCard}>
        <View style={styles.walletInfo}>
          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>Account Number</Text>
            <Text style={styles.walletValue}>
              {paystackSubAccount.accountNumber}
            </Text>
          </View>
          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>Account Name</Text>
            <Text style={styles.walletValue}>
              {paystackSubAccount.accountName}
            </Text>
          </View>
          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>Bank</Text>
            <Text style={styles.walletValue}>
              {paystackSubAccount.bankName}
            </Text>
          </View>
          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>Available Balance</Text>
            <Text style={[styles.walletValue, styles.balanceText]}>
              ₦
              {balance.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (!canWithdraw || withdrawDisabled) && styles.withdrawButtonDisabled,
          ]}
          onPress={onWithdraw}
          disabled={!canWithdraw || withdrawDisabled}
        >
          <CreditCard size={20} color="white" />
          <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
        </TouchableOpacity>
        {!canWithdraw && (
          <Text style={styles.minWithdrawText}>
            Minimum withdrawal: ₦1,000
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginTop: 24,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walletTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
  },
  sectionDescription: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 4,
    marginBottom: 8,
  },
  walletCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  walletInfo: {
    gap: 12,
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletLabel: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  walletValue: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
  },
  balanceText: {
    fontSize: 18,
    color: Colors.primary,
  },
  withdrawButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonText: {
    color: "white",
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
  minWithdrawText: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 8,
  },
  noWalletCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 24,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  noWalletTitle: {
    fontSize: 18,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginTop: 12,
  },
  noWalletDescription: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 8,
  },
  createWalletButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    minWidth: 200,
  },
  createWalletButtonText: {
    color: "white",
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
});

export default WalletDisplay;
