import {
  createPaystackSubAccount,
  editUser,
  getNigerianBanks,
  getMyProfile,
  getUserById,
  verifyBankAccount,
  withdrawFromWallet,
} from "@/api/services/userServices";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  CreditCard,
  Search,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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
  const [searchTerm, setSearchTerm] = useState("");

  // Bank account fields
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null); // { name, code, slug }
  const [verifiedAccountName, setVerifiedAccountName] = useState("");
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [banks, setBanks] = useState([]);
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("");
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

          // Fetch banks for wallet creation
          const banksResponse = await getNigerianBanks();
          setBanks(banksResponse.banks || []);
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

  // List of Nigerian banks
  const nigerianBanks = [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank (FCMB)",
    "Globus Bank",
    "Guaranty Trust Bank (GTBank)",
    "Heritage Bank",
    "Jaiz Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "SunTrust Bank",
    "Titan Trust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Kuda Bank",
    "Opay",
    "PalmPay",
    "Moniepoint",
    "VFD Microfinance Bank",
    "Carbon (Formerly Paylater)",
    "Rubies Bank",
    "TAJ Bank",
    "Parallex Bank",
    "Premium Trust Bank",
    "Lotus Bank",
    "Coronation Merchant Bank",
    "FBN Merchant Bank",
    "FSDH Merchant Bank",
    "Greenwich Merchant Bank",
    "Nova Merchant Bank",
    "Rand Merchant Bank",
  ];

  // Paystack payment methods
  const paystackPaymentMethods = [
    "Card (Visa, Mastercard, Verve)",
    "Bank Transfer",
    "USSD",
    "Mobile Money",
    "QR Code",
    "Apple Pay",
    "Google Pay",
    "Bank Branch",
    "POS",
    "EFT",
  ];

  // Payout methods for African countries
  const payoutMethods = ["Bank Transfer", "Mobile Money (Momo)", "M-Pesa"];

  // Mobile Money providers
  const mobileProviders = [
    "MTN Mobile Money",
    "Airtel Money",
    "Orange Money",
    "Vodafone Cash",
    "Tigo Cash",
    "Ecobank Mobile",
    "UBA Mobile Money",
  ];

  // Filter banks based on search term
  const filteredBanks = nigerianBanks.filter((bank) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter payment methods based on search term
  const filteredPaymentMethods = paystackPaymentMethods.filter((method) =>
    method.toLowerCase().includes(paymentSearchTerm.toLowerCase())
  );

  const selectBank = (bankName) => {
    setItem({ ...item, selectedBank: bankName });
    setShowBankModal(false);
    setSearchTerm("");
  };

  const selectPaymentMethod = (paymentMethod) => {
    setItem({ ...item, paymentMethod });
    setShowPaymentModal(false);
    setPaymentSearchTerm("");
  };

  const selectPayoutMethod = (payoutMethod) => {
    // Reset relevant fields when changing payout method
    const updatedItem = {
      ...item,
      payoutMethod,
      // Reset fields
      bankAccountNumber: "",
      bankAccountName: "",
      selectedBank: "",
      mobileNumber: "",
      mobileProvider: "",
      mpesaNumber: "",
      mpesaName: "",
    };
    setItem(updatedItem);
    setShowPayoutModal(false);
  };

  const selectMobileProvider = (provider) => {
    setItem({ ...item, mobileProvider: provider });
    setShowMobileProviderModal(false);
  };

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

            {item.paystackSubAccount ? (
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
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.withdrawModalContainer}>
            <View style={styles.withdrawModalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity
                onPress={() => setShowWithdrawModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.withdrawModalContent}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>
                  ₦
                  {(
                    (item.paystackSubAccount?.balance || 0) / 100
                  ).toLocaleString("en-NG", {
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
                  Withdrawals are processed within 24-48 hours to your
                  registered bank account
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, isWithdrawing && styles.buttonDisabled]}
                onPress={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Confirm Withdrawal</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Wallet Modal */}
      <Modal
        visible={showCreateWalletModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
        onRequestClose={() => setShowCreateWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.withdrawModalContainer}>
            <View style={styles.withdrawModalHeader}>
              <Text style={styles.modalTitle}>Create Wallet</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateWalletModal(false);
                  setBankAccountNumber("");
                  setSelectedBank(null);
                  setVerifiedAccountName("");
                  setIsAccountVerified(false);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.withdrawModalContent}>
              <View style={styles.withdrawInfo}>
                <AlertCircle size={16} color={Colors.primary} />
                <Text style={styles.infoTextPrimary}>
                  Link your bank account to receive payments and withdraw
                  earnings
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
                  onPress={() => setShowBankModal(true)}
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
                    <Text style={styles.verifiedName}>
                      {verifiedAccountName}
                    </Text>
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
                  onPress={handleVerifyBankAccount}
                  disabled={
                    isVerifyingBank || !bankAccountNumber || !selectedBank
                  }
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
                  style={[
                    styles.button,
                    isCreatingWallet && styles.buttonDisabled,
                  ]}
                  onPress={handleCreateWallet}
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
            </View>
          </View>
        </View>
      </Modal>

      {/* Bank Selection Modal */}
      <Modal
        visible={showBankModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBankModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            <TouchableOpacity
              onPress={() => setShowBankModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Search
              size={20}
              color={Colors.gray600}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search banks..."
              placeholderTextColor="#B0B0B0"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Banks List */}
          <FlatList
            data={banks.filter((bank) =>
              bank.name.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            keyExtractor={(item, index) => item.code || index.toString()}
            renderItem={({ item: bank }) => (
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => {
                  setSelectedBank(bank);
                  setShowBankModal(false);
                  setSearchTerm("");
                  setIsAccountVerified(false);
                  setVerifiedAccountName("");
                }}
              >
                <Text style={styles.bankItemText}>{bank.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  withdrawModalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: Platform.OS === "ios" ? 50 : 60,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
  },
  bankItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  bankItemText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
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
});

export default EditProfile;
