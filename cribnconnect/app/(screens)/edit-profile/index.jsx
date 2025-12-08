import {
  createPaystackSubAccount,
  editUser,
  getMyProfile,
  getUserById,
  verifyBankAccount,
  withdrawFromWallet,
} from "@/api/services/userServices";
import BackHeader from "@/components/BackHeader";
import BankSelectionModal from "@/components/modals/BankSelectionModal";
import CreateWalletModal from "@/components/modals/CreateWalletModal";
import WithdrawModal from "@/components/modals/WithdrawModal";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertCircle,
  CreditCard,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { publicProfile, refreshPublicProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Bank account fields
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null); // { name, code }
  const [verifiedAccountName, setVerifiedAccountName] = useState("");
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [item, setItem] = useState({
    ImageUri: require("../../../assets/images/displayimageCC.jpg"),
    _id: "",
    uid: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    isVerified: false,
    userType: "guest",
    rating: 0,
    // Paystack wallet fields
    paystackSubAccount: null, // { subAccountCode, accountNumber, accountName, bankName, balance }
  });

  // Fetch user data and banks on mount
  useEffect(() => {
    const fetchData = async () => {
      if (publicProfile?._id) {
        try {
          setLoading(true);

          // Fetch user data using /users/me endpoint
          const response = await getMyProfile();
          const userData = response.user;

          setItem({
            ...item,
            _id: userData._id,
            uid: userData.uid,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            isVerified: userData.isVerified || false,
            userType: userData.userType || "guest",
            rating: userData.rating || 0,
            paystackSubAccount: userData.paystackSubAccount || null,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          Alert.alert("Error", "Failed to load user data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [publicProfile]);

  const handleVerifyBankAccount = async () => {
    if (!bankAccountNumber || bankAccountNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit account number");
      return;
    }

    if (!selectedBank) {
      Alert.alert("Error", "Please select a bank");
      return;
    }

    try {
      setIsVerifyingBank(true);
      const response = await verifyBankAccount(
        bankAccountNumber,
        selectedBank.code
      );

      if (response.success && response.accountDetails) {
        setVerifiedAccountName(response.accountDetails.accountName);
        setIsAccountVerified(true);
        Alert.alert(
          "Success",
          `Account verified: ${response.accountDetails.accountName}`
        );
      }
    } catch (error) {
      console.error("Error verifying bank account:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to verify bank account"
      );
      setIsAccountVerified(false);
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const handleCreateWallet = async () => {
    if (!isAccountVerified) {
      Alert.alert("Error", "Please verify your bank account first");
      return;
    }

    try {
      setIsCreatingWallet(true);
      const response = await createPaystackSubAccount(
        item._id,
        bankAccountNumber,
        selectedBank.code
      );

      if (response.success && response.paystackSubAccount) {
        setItem({
          ...item,
          paystackSubAccount: response.paystackSubAccount,
        });
        await refreshPublicProfile();
        setShowCreateWalletModal(false);
        setBankAccountNumber("");
        setSelectedBank(null);
        setVerifiedAccountName("");
        setIsAccountVerified(false);
        Alert.alert("Success", "Wallet created successfully!");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create wallet"
      );
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleWithdraw = async () => {
    if (
      !withdrawAmount ||
      isNaN(withdrawAmount) ||
      parseFloat(withdrawAmount) <= 0
    ) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const balance = (item.paystackSubAccount?.balance || 0) / 100; // Convert from kobo to naira

    if (amount < 1000) {
      Alert.alert("Error", "Minimum withdrawal amount is ₦1,000");
      return;
    }

    if (amount > balance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }

    try {
      setIsWithdrawing(true);
      const response = await withdrawFromWallet(item._id, { amount });

      if (response.success) {
        // Refresh user data to get updated balance
        const userResponse = await getMyProfile();
        setItem({
          ...item,
          paystackSubAccount: userResponse.user.paystackSubAccount || null,
        });

        setShowWithdrawModal(false);
        setWithdrawAmount("");
        Alert.alert(
          "Success",
          response.message || "Withdrawal request submitted successfully!"
        );
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process withdrawal"
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phone,
        bio: item.bio,
      };

      await editUser(item._id, updateData);
      await refreshPublicProfile();
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to save changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <BackHeader title="Edit Profile" showUser={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Edit Profile" showUser={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.ImageUri}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={{ margin: 18 }}>
            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                placeholder="First Name"
                value={item.firstName}
                style={styles.input}
                onChangeText={(text) => setItem({ ...item, firstName: text })}
              />
            </View>
            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                placeholder="Last Name"
                value={item.lastName}
                style={styles.input}
                onChangeText={(text) => setItem({ ...item, lastName: text })}
              />
            </View>
            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Email"
                value={item.email}
                style={styles.input}
                keyboardType="email-address"
                onChangeText={(text) => setItem({ ...item, email: text })}
              />
            </View>
            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                placeholder="Phone Number"
                value={item.phone}
                style={styles.input}
                keyboardType="phone-pad"
                onChangeText={(text) => setItem({ ...item, phone: text })}
              />
            </View>
            <View style={{ marginTop: 24 }}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                placeholder="Tell us about yourself"
                value={item.bio}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setItem({ ...item, bio: text })}
              />
            </View>

            {/* User Type and Verification Status */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>User Type</Text>
                <Text style={styles.infoValue}>{item.userType}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Verified</Text>
                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: item.isVerified ? Colors.primary : Colors.gray600,
                    },
                  ]}
                >
                  {item.isVerified ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </View>

          {/* Paystack Wallet Section */}
          <View style={{ marginHorizontal: 18, marginTop: 24 }}>
            <View style={styles.walletHeader}>
              <Wallet size={24} color={Colors.primary} />
              <Text style={styles.walletTitle}>Paystack Wallet</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Manage your earnings and withdrawals
            </Text>

            {item.paystackSubAccount && 
             item.paystackSubAccount.accountNumber && 
             item.paystackSubAccount.accountName ? (
              <View style={styles.walletCard}>
                <View style={styles.walletInfo}>
                  <View style={styles.walletRow}>
                    <Text style={styles.walletLabel}>Account Number</Text>
                    <Text style={styles.walletValue}>
                      {item.paystackSubAccount.accountNumber}
                    </Text>
                  </View>
                  <View style={styles.walletRow}>
                    <Text style={styles.walletLabel}>Account Name</Text>
                    <Text style={styles.walletValue}>
                      {item.paystackSubAccount.accountName}
                    </Text>
                  </View>
                  <View style={styles.walletRow}>
                    <Text style={styles.walletLabel}>Bank</Text>
                    <Text style={styles.walletValue}>
                      {item.paystackSubAccount.bankName}
                    </Text>
                  </View>
                  <View style={styles.walletRow}>
                    <Text style={styles.walletLabel}>Available Balance</Text>
                    <Text style={[styles.walletValue, styles.balanceText]}>
                      ₦
                      {(
                        (item.paystackSubAccount.balance || 0) / 100
                      ).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.withdrawButton,
                    (!item.paystackSubAccount.balance ||
                      item.paystackSubAccount.balance < 100000) &&
                      styles.withdrawButtonDisabled,
                  ]}
                  onPress={() => setShowWithdrawModal(true)}
                  disabled={
                    !item.paystackSubAccount.balance ||
                    item.paystackSubAccount.balance < 100000
                  }
                >
                  <CreditCard size={20} color="white" />
                  <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
                </TouchableOpacity>
                {(!item.paystackSubAccount.balance ||
                  item.paystackSubAccount.balance < 100000) && (
                  <Text style={styles.minWithdrawText}>
                    Minimum withdrawal: ₦1,000
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.noWalletCard}>
                <AlertCircle size={48} color={Colors.gray600} />
                <Text style={styles.noWalletTitle}>No Wallet Yet</Text>
                <Text style={styles.noWalletDescription}>
                  Create a Paystack wallet to receive payments and manage your
                  earnings
                </Text>
                <TouchableOpacity
                  style={styles.createWalletButton}
                  onPress={() => setShowCreateWalletModal(true)}
                >
                  <Wallet size={20} color="white" />
                  <Text style={styles.createWalletButtonText}>
                    Create Wallet
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isSaving && styles.buttonDisabled]}
            onPress={saveChanges}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Add bottom padding to ensure content isn't hidden behind keyboard */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Withdraw Modal */}
      <WithdrawModal
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        balance={item.paystackSubAccount?.balance || 0}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        onWithdraw={handleWithdraw}
        isWithdrawing={isWithdrawing}
      />

      {/* Create Wallet Modal */}
      <CreateWalletModal
        visible={showCreateWalletModal && !showBankModal}
        onClose={() => {
          console.log("Closing Create Wallet Modal");
          setShowCreateWalletModal(false);
          setBankAccountNumber("");
          setSelectedBank(null);
          setVerifiedAccountName("");
          setIsAccountVerified(false);
        }}
        bankAccountNumber={bankAccountNumber}
        setBankAccountNumber={setBankAccountNumber}
        selectedBank={selectedBank}
        onSelectBank={() => {
          console.log("Opening bank selection modal");
          setShowBankModal(true);
        }}
        verifiedAccountName={verifiedAccountName}
        isAccountVerified={isAccountVerified}
        onVerifyAccount={handleVerifyBankAccount}
        isVerifyingBank={isVerifyingBank}
        onCreateWallet={handleCreateWallet}
        isCreatingWallet={isCreatingWallet}
      />

      {/* Bank Selection Modal */}
      <BankSelectionModal
        visible={showBankModal}
        onClose={() => {
          console.log("Closing bank selection modal");
          setShowBankModal(false);
        }}
        onSelectBank={(bank) => {
          console.log("Bank selected in parent:", bank);
          setSelectedBank(bank);
          setIsAccountVerified(false);
          setVerifiedAccountName("");
          setShowBankModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: Colors.primary,
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
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  label: {
    color: "#111827",
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-SemiBold",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 18,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  sectionDescription: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginTop: 4,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.primary,
    marginTop: 4,
  },
  // Wallet Styles
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

export default EditProfile;
