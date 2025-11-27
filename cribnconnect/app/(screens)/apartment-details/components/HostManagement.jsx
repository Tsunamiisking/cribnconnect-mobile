import api from "@/api/api";
import { Colors } from "@/constants/Colors";
import {
  Calendar,
  DollarSign,
  Eye,
  HatGlasses,
  MoreVertical,
  Trash2,
  X
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const HostManagement = ({
  apartment,
  isHost,
  onApartmentUpdate,
  onApartmentDelete,
  section = "all",
}) => {
  const [showHostMenu, setShowHostMenu] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [showEditAvailabilityModal, setShowEditAvailabilityModal] =
    useState(false);
  const [editedPricePerNight, setEditedPricePerNight] = useState(
    apartment.pricing?.perNight ? String(apartment.pricing.perNight) : ""
  );
  const [editedPricePerWeek, setEditedPricePerWeek] = useState(
    apartment.pricing?.perWeek ? String(apartment.pricing.perWeek) : ""
  );
  const [editedPricePerMonth, setEditedPricePerMonth] = useState(
    apartment.pricing?.perMonth ? String(apartment.pricing.perMonth) : ""
  );
  const [editedAvailabilityFrom, setEditedAvailabilityFrom] = useState("");
  const [editedAvailabilityTo, setEditedAvailabilityTo] = useState("");
  const [availabilityToggle, setAvailabilityToggle] = useState(
    apartment?.isAvailable === undefined ? true : apartment.isAvailable
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPrice = () => {
    setShowHostMenu(false);
    setShowEditPriceModal(true);
  };

  const handleEditAvailability = () => {
    setShowHostMenu(false);
    setShowEditAvailabilityModal(true);
  };

  // Format a raw numeric string into localized thousands-separated string as user types
  const formatNaira = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    // remove any non-digit characters
    const digits = str.replace(/[^0-9]/g, "");
    if (digits.length === 0) return "";
    // format with locale separators, no decimals
    try {
      return parseInt(digits, 10).toLocaleString();
    } catch (e) {
      return digits;
    }
  };

  // Display formatter with Naira sign and two decimals for readout
  const formatNairaDisplay = (value) => {
    if (!value) return "";
    const digits = String(value).replace(/[^0-9]/g, "");
    if (!digits) return "";
    try {
      const num = parseInt(digits, 10);
      return `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch (e) {
      return `₦${digits}`;
    }
  };

  // Format date input as YYYY-MM-DD while typing
  // Accepts any string, strips non-digits, inserts dashes after YYYY and MM
  // Clamps month to 1-12 and day to 1-31 (basic clamp)
  const formatDateInput = (value) => {
    if (value === null || value === undefined) return "";
    // keep only digits
    let digits = String(value).replace(/[^0-9]/g, "").slice(0, 8); // YYYYMMDD max

    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);

    const parts = [];
    if (y) parts.push(y);
    if (m) {
      // basic clamp for month
      const mn = parseInt(m, 10);
      const mm = isNaN(mn) ? m : String(Math.max(1, Math.min(12, mn))).padStart(m.length, '0');
      parts.push(mm);
    } else if (digits.length > 4 && !m) {
      parts.push(digits.slice(4));
    }
    if (d) {
      // basic clamp for day
      const dn = parseInt(d, 10);
      const dd = isNaN(dn) ? d : String(Math.max(1, Math.min(31, dn))).padStart(d.length, '0');
      parts.push(dd);
    }

    return parts.join('-');
  };

  const renderModals = () => (
    <>
      <Modal
        visible={showHostMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHostMenu(false)}
      >
        <TouchableOpacity
          style={styles.hostMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowHostMenu(false)}
        >
          <View style={styles.hostMenuContainer}>
            <Text style={styles.hostMenuTitle}>Manage Listing</Text>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleEditPrice}
            >
              <DollarSign size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Pricing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleEditAvailability}
            >
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Availability</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleTogglePublish}
            >
              <HatGlasses size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>
                {apartment?.isPublished ? "Unpublish" : "Publish"} Listing
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleSaveAvailability}
            >
              <Eye size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>
                Mark {apartment?.isPublished ? "Unavailable" : "Available"}
              </Text>
            </TouchableOpacity> */}

            <View style={styles.hostMenuDivider} />

            <TouchableOpacity
              style={[styles.hostMenuItem, styles.hostMenuItemDanger]}
              onPress={handleDeleteApartment}
            >
              <Trash2 size={20} color={Colors.error} />
              <Text
                style={[styles.hostMenuItemText, styles.hostMenuItemDangerText]}
              >
                Delete Apartment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostMenuCancel}
              onPress={() => setShowHostMenu(false)}
            >
              <Text style={styles.hostMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Price Modal */}
      <Modal
        visible={showEditPriceModal}
        animationType="slide"
        onRequestClose={() => setShowEditPriceModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditPriceModal(false)}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Pricing</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per Night (₦)</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 60,
                  borderWidth: 1,
                  borderColor: Colors.borderColor || Colors.gray300,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora-Medium",
                    fontSize: 18,
                    color: Colors.primary,
                    marginRight: 8,
                  }}
                >
                  ₦
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontFamily: "Sora-Regular",
                    fontSize: 16,
                    color: Colors.primary,
                    padding: 0,
                  }}
                  placeholder="5000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={editedPricePerNight || ""}
                  onChangeText={(t) =>
                    setEditedPricePerNight(String(t).replace(/[^0-9]/g, ""))
                  }
                />
              </View>
              {editedPricePerNight && (
                <Text style={[styles.inputHint, { marginTop: 8 }]}>
                  {formatNairaDisplay(editedPricePerNight)} per night
                </Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Price per Week (₦) - Optional
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 60,
                  borderWidth: 1,
                  borderColor: Colors.borderColor || Colors.gray300,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora-Medium",
                    fontSize: 18,
                    color: Colors.primary,
                    marginRight: 8,
                  }}
                >
                  ₦
                </Text>
                <TextInput
                  style={{
                    flex: 1,
                    fontFamily: "Sora-Regular",
                    fontSize: 16,
                    color: Colors.primary,
                    padding: 0,
                  }}
                  placeholder="30000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={editedPricePerWeek || ""}
                  onChangeText={(t) =>
                    setEditedPricePerWeek(String(t).replace(/[^0-9]/g, ""))
                  }
                />
              </View>
              {editedPricePerWeek && (
                <Text style={[styles.inputHint, { marginTop: 8 }]}>
                  {formatNairaDisplay(editedPricePerWeek)} per week
                </Text>
              )}
            </View>

            {/* <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Price per Month (₦) - Optional
              </Text>
              <TextInput
                style={styles.input}
                value={editedPricePerMonth}
                onChangeText={setEditedPricePerMonth}
                keyboardType="numeric"
                placeholder="Enter price per month"
                placeholderTextColor={Colors.gray400}
              />
            </View> */}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSavePrice}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonText}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Availability Modal */}
      <Modal
        visible={showEditAvailabilityModal}
        animationType="slide"
        onRequestClose={() => setShowEditAvailabilityModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditAvailabilityModal(false)}
            >
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Availability</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Set the dates when your apartment is available for booking.
            </Text>

            {/* Availability toggle - mark listing available/unavailable */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={[styles.largeLabel, { marginBottom: 0 }]}>Mark as {availabilityToggle ? "Unavailable" : "Available"}</Text>
              <Switch
                value={availabilityToggle}
                onValueChange={(val) => setAvailabilityToggle(val)}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
                thumbColor={availabilityToggle ? Colors.white : Colors.white}
              />
            </View>

            {availabilityToggle ? (
              <>
                <View style={[styles.inputGroup, {marginTop: 20}]}>
                  <Text style={styles.inputLabel}>Available From</Text>
                  <TextInput
                    style={styles.input}
                    value={editedAvailabilityFrom}
                    onChangeText={(t) => setEditedAvailabilityFrom(formatDateInput(t))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.gray400}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <Text style={styles.inputHint}>
                    Format: YYYY-MM-DD (e.g., 2025-01-01)
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Available To</Text>
                  <TextInput
                    style={styles.input}
                    value={editedAvailabilityTo}
                    onChangeText={(t) => setEditedAvailabilityTo(formatDateInput(t))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.gray400}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <Text style={styles.inputHint}>
                    Format: YYYY-MM-DD (e.g., 2025-12-31)
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ marginVertical: 12 }}>
                <Text style={[styles.inputHint, { color: Colors.gray600 }]}>Listing is marked unavailable — availability dates are hidden.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSaveAvailability}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonText}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );

  const handleSavePrice = async () => {
    setIsSaving(true);
    try {
      const response = await api.put(`/apartments/${apartment.id}/pricing`, {
        pricePerNight: parseInt(editedPricePerNight),
        pricePerWeek: editedPricePerWeek ? parseInt(editedPricePerWeek) : null,
      });

      // console.log("Price updated successfully:", response.data);

      // Update parent component
      onApartmentUpdate({
        ...apartment,
        pricing: {
          perNight: editedPricePerNight,
          perWeek: editedPricePerWeek,
          // perMonth: editedPricePerMonth,
        },
      });

      Alert.alert("Success", "Pricing updated successfully");
      setShowEditPriceModal(false);
    } catch (error) {
      console.error("Failed to update price:", error);
      Alert.alert("Error", "Failed to update pricing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    try {
      const response = await api.put(
        `/apartments/${apartment.id}/availability`,
        {
          from: new Date(editedAvailabilityFrom),
          to: new Date(editedAvailabilityTo),
          isAvailable: availabilityToggle,
        }
      );

      console.log("Availability updated successfully:", response.data);

      Alert.alert("Success", "Availability updated successfully");
      setShowEditAvailabilityModal(false);
    } catch (error) {
      console.error("Failed to update availability:", error);
      Alert.alert("Error", "Failed to update availability. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = () => {
    setShowHostMenu(false);
    const newStatus = !apartment.isAvailable;
    Alert.alert(
      newStatus ? "Publish?" : "Unpublish?",
      newStatus
        ? "Make this publicly available for Users?"
        : "Make this apartment as private (Non Visible to Users)?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Available" : "Unavailable",
          onPress: async () => {
            try {
              const response = await api.put(
                `/apartments/${apartment.id}/status`,
                {
                  isAvailable: newStatus,
                }
              );

              console.log("Availability status updated:", response.data);

              onApartmentUpdate({
                ...apartment,
                isAvailable: newStatus,
              });

              Alert.alert(
                "Success",
                `Apartment marked as ${newStatus ? "available" : "unavailable"} successfully`
              );
            } catch (error) {
              console.error("Failed to update availability status:", error);
              Alert.alert(
                "Error",
                "Failed to update status. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteApartment = () => {
    setShowHostMenu(false);
    Alert.alert(
      "Delete Apartment",
      "Are you sure you want to delete this apartment? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/apartments/${apartment.id}`);
              console.log("Apartment deleted successfully");

              Alert.alert("Success", "Apartment deleted successfully");
              onApartmentDelete();
            } catch (error) {
              console.error("Failed to delete apartment:", error);
              Alert.alert(
                "Error",
                "Failed to delete apartment. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (!isHost) {
    return null;
  }

  if (!isHost) return null;

  // Render only the menu button for header
  if (section === "menuButton") {
    return (
      <>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowHostMenu(true)}
        >
          <MoreVertical size={24} color={Colors.black} />
        </TouchableOpacity>

        {/* Modals are included here so they work from the menu button */}
        {renderModals()}
      </>
    );
  }

  // Render only the stats banner
  if (section === "statsBanner") {
    return (
      <View style={styles.hostStatsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{apartment.stats?.views || 0}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{apartment.stats?.bookings || 0}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ₦{(apartment.stats?.revenue || 0).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>
    );
  }

  // Render only the quick actions
  if (section === "quickActions") {
    return (
      <View style={styles.hostActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.hostActionsGrid}>
          <TouchableOpacity
            style={styles.hostActionCard}
            onPress={handleEditPrice}
          >
            <DollarSign size={24} color={Colors.primary} />
            <Text style={styles.hostActionText}>Edit Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.hostActionCard}
            onPress={handleEditAvailability}
          >
            <Calendar size={24} color={Colors.primary} />
            <Text style={styles.hostActionText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.hostActionCard}
            onPress={handleTogglePublish}
          >
            <Eye
              size={24}
              color={apartment.isAvailable ? Colors.success : Colors.gray500}
            />
            <Text style={styles.hostActionText}>
              {apartment.isAvailable ? "Mark Unavailable" : "Mark Available"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Helper function to render all modals

  // Default: render all sections together (backward compatibility)
  return <>{renderModals()}</>;
};

const styles = StyleSheet.create({
  hostStatsBanner: {
    flexDirection: "row",
    backgroundColor: Colors.gray50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    // alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Sora-Bold",
    color: Colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray300,
    marginHorizontal: 12,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  hostActionsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
    marginBottom: 12,
  },
  hostActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  hostActionCard: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  hostActionText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
    textAlign: "center",
  },
  hostMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  hostMenuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hostMenuTitle: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    color: Colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  hostMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  hostMenuItemText: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
    color: Colors.black,
  },
  hostMenuItemDanger: {},
  hostMenuItemDangerText: {
    color: Colors.error,
  },
  hostMenuDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 12,
  },
  hostMenuCancel: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  hostMenuCancelText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray600,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Sora-Bold",
    color: Colors.black,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 24,
    lineHeight: 20,
  },
  spaceFiller: {
    height: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
    color: Colors.black,
    marginBottom: 8,
  },
  largeLabel: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputHint: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray500,
    marginTop: 6,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
});

export default HostManagement;
