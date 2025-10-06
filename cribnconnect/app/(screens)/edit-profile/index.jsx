import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { ChevronDown, Search } from "lucide-react-native";
import { useState } from "react";
import {
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
  const [item, setItem] = useState({
    ImageUri: require("../../../assets/images/displayimageCC.jpg"),
    fullName: "John Doe",
    email: "douglasallendev@gmail.com",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "USA",
    },
    bankName: "",
    accountNumber: "",
    accountName: "Douglas Allen Oluwatobi",
  });

  const [showBankModal, setShowBankModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter banks based on search term
  const filteredBanks = nigerianBanks.filter(bank =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectBank = (bankName) => {
    setItem({ ...item, bankName });
    setShowBankModal(false);
    setSearchTerm("");
  };

  const saveChanges = () => {
    // Logic to save changes goes here
    console.log("Changes saved:", item);
  };

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
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                labelText="Full Name"
                // placeholder="Full Name"
                value={item.fullName}
                style={styles.input}
                onChangeText={(text) => setItem({ ...item, fullName: text })}
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
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#B0B0B0"
                value={item.address.street}
                onChangeText={(text) =>
                  setItem({
                    ...item,
                    address: { ...item.address, street: text },
                  })
                }
              />
              <View style={styles.rowContainer}>
                <View style={styles.rowInputContainer}>
                  <TextInput
                    style={styles.rowInput}
                    placeholder="State"
                    placeholderTextColor="#B0B0B0"
                    value={item.address.state}
                    onChangeText={(text) =>
                      setItem({
                        ...item,
                        address: { ...item.address, state: text },
                      })
                    }
                  />
                </View>
                <View style={styles.rowInputContainer}>
                  <TextInput
                    style={styles.rowInput}
                    placeholder="City"
                    placeholderTextColor="#B0B0B0"
                    value={item.address.city}
                    onChangeText={(text) =>
                      setItem({
                        ...item,
                        address: { ...item.address, city: text },
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.rowInputContainer}>
                  <TextInput
                    style={styles.rowInput}
                    placeholder="Zip Code"
                    placeholderTextColor="#B0B0B0"
                    value={item.address.zip}
                    onChangeText={(text) =>
                      setItem({
                        ...item,
                        address: { ...item.address, zip: text },
                      })
                    }
                  />
                </View>
                <View style={styles.rowInputContainer}>
                  <TextInput
                    style={styles.rowInput}
                    placeholder="Country"
                    placeholderTextColor="#B0B0B0"
                    value={item.address.country}
                    onChangeText={(text) =>
                      setItem({
                        ...item,
                        address: { ...item.address, country: text },
                      })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 18, marginTop: 10 }}>
            <Text style={styles.label}>Payment and Privacy</Text>
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              placeholderTextColor="#B0B0B0"
              value={item.accountNumber}
              onChangeText={(text) =>
                setItem({ ...item, accountNumber: text })
              }
              keyboardType="numeric"
              maxLength={10}
            />
            
            {/* Bank Selection */}
            <TouchableOpacity
              style={[styles.input, styles.bankSelector]}
              onPress={() => setShowBankModal(true)}
            >
              <Text style={[
                styles.bankSelectorText,
                !item.bankName && styles.placeholderText
              ]}>
                {item.bankName || "Select Bank"}
              </Text>
              <ChevronDown size={20} color={Colors.gray600} />
            </TouchableOpacity>

            {/* <TextInput
              style={styles.input}
              placeholder="Account Name"
              placeholderTextColor="#B0B0B0"
              value={item.accountName}
              onChangeText={(text) =>
                setItem({ ...item, accountName: text })
              }
            /> */}
            <Text style={[styles.searchInput, { marginTop: 12 }]}>
              Account Name: <Text style={{ fontFamily: "Sora-Medium" }}>{item.accountName}</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={saveChanges}>
            <Text
              style={{
                color: "white",
                fontFamily: "Sora-SemiBold",
                fontSize: 16,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>

          {/* Add bottom padding to ensure content isn't hidden behind keyboard */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

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
            <Search size={20} color={Colors.gray600} style={styles.searchIcon} />
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
            data={filteredBanks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item: bank }) => (
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => selectBank(bank)}
              >
                <Text style={styles.bankItemText}>{bank}</Text>
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rowInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  rowInput: {
    height: Platform.OS === "ios" ? 50 : 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    color: Colors.primary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Sora-Regular",
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
});

export default EditProfile;
