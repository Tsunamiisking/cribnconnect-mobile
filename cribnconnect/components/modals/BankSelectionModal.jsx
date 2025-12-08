import { Colors } from "@/constants/Colors";
import { getNigerianBanks } from "@/api/services/userServices";
import { Search } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BankSelectionModal = ({ visible, onClose, onSelectBank }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch banks when modal becomes visible
  useEffect(() => {
    if (visible && banks.length === 0) {
      fetchBanks();
    }
  }, [visible]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching banks from API...");
      const response = await getNigerianBanks();
      console.log("Banks fetched successfully:", response.banks?.length || 0);
      setBanks(response.banks || []);
    } catch (err) {
      console.error("Error fetching banks:", err);
      setError("Failed to load banks");
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBank = (bank) => {
    console.log("Bank selected:", bank.name, bank.code);
    onSelectBank(bank);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  console.log("BankSelectionModal rendered, visible:", visible);
  console.log("Total banks:", banks.length);
  console.log("Filtered banks:", filteredBanks.length);
  console.log("Loading:", loading);

  if (!visible) {
    console.log("BankSelectionModal returning null - not visible");
    return null;
  }

  console.log("BankSelectionModal rendering Modal component");

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      presentationStyle="fullScreen"
      hardwareAccelerated={true}
      onShow={() => console.log("BankSelectionModal onShow triggered")}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Bank</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray600} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search banks..."
            placeholderTextColor="#B0B0B0"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCorrect={false}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading banks...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBanks}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBanks}
            keyExtractor={(item, index) => `${item.code}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => handleSelectBank(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.bankItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchTerm ? "No banks found" : "No banks available"}
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  title: {
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
    backgroundColor: "white",
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
  listContent: {
    flexGrow: 1,
  },
  bankItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "white",
  },
  bankItemText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
  },
});

export default BankSelectionModal;
