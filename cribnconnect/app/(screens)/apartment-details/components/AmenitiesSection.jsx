import { Colors } from "@/constants/Colors";
import { basicAmenities, luxuryAmenities, sharedAmenities } from "@/utils/amenities";
import { Plus, X } from "lucide-react-native";
import { React, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AmenitiesSection = ({ amenities, amenityIcons, isHost = false, onSaveAmenities }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [initialSelectedAmenities, setInitialSelectedAmenities] = useState([]);

  const renderAmenity = (amenityName, isHost) => {
    const IconComponent = amenityIcons[amenityName];
    return (
      <View key={amenityName} style={styles.amenityItem}>
        {IconComponent && <IconComponent width={24} height={24} />}
        <Text style={styles.amenityText}>{amenityName}</Text>
        {isHost && (
          <TouchableOpacity style={styles.removeAmenityButton}>
            <X size={16} color={Colors.black} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Modal rendering logic
  const handleOpenAmenityModal = (category) => {
    setSelectedCategory(category);
    // initialize selection from current amenities for this category
    const current =
      category === "basic"
        ? amenities.basic || []
        : category === "luxury"
        ? amenities.luxury || []
        : category === "shared"
        ? amenities.shared || []
        : [];
    // current may be array of names or objects; normalize to names
    const normalized = (current || []).map((a) => (typeof a === "string" ? a : a.name));
    setInitialSelectedAmenities(normalized);
    setSelectedAmenities(normalized);
    setModalVisible(true);
  };

  // Selection state for modal
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Helper to split array into rows of 2 (from Step6.jsx)
  function toRows(arr) {
    const rows = [];
    for (let i = 0; i < arr.length; i += 2) {
      rows.push(arr.slice(i, i + 2));
    }
    return rows;
  }

  // Get amenities for current modal category
  let modalAmenities = [];
  if (selectedCategory === "basic") modalAmenities = basicAmenities;
  if (selectedCategory === "luxury") modalAmenities = luxuryAmenities;
  if (selectedCategory === "shared") modalAmenities = sharedAmenities;

  // Select/deselect amenities in modal
  const handleAmenitySelect = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Check if there are any amenities at all
  const hasBasicAmenities = amenities.basic && amenities.basic.length > 0;
  const hasLuxuryAmenities = amenities.luxury && amenities.luxury.length > 0;
  const hasSharedAmenities = amenities.shared && amenities.shared.length > 0;
  const hasOtherAmenities = amenities.other && amenities.other.length > 0;

  if (
    !hasBasicAmenities &&
    !hasLuxuryAmenities &&
    !hasSharedAmenities &&
    !hasOtherAmenities
  ) {
    return null;
  }

  return (
    <View style={styles.amenitiesSection}>
      <Text style={styles.sectionTitle}>Amenities</Text>

      {/* Basic Amenities */}
      {hasBasicAmenities && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Basic Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.basic.map((amenity) => renderAmenity(amenity, isHost))}
            {isHost && (
              <TouchableOpacity
                style={styles.addAmenityButton}
                onPress={() => handleOpenAmenityModal("basic")}
              >
                <Text style={styles.addAmenityButtonText}>
                  Add Basic Amenities
                </Text>
                <Plus size={16} color={Colors.black} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Luxury Amenities */}
      {hasLuxuryAmenities && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Luxury Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.luxury.map((amenity) => renderAmenity(amenity, isHost))}
            {isHost && (
              <TouchableOpacity
                style={styles.addAmenityButton}
                onPress={() => handleOpenAmenityModal("luxury")}
              >
                <Text style={styles.addAmenityButtonText}>
                  Add Luxury Amenities
                </Text>
                <Plus size={16} color={Colors.black} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Shared Amenities */}
      {hasSharedAmenities && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Shared Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.shared.map((amenity) => renderAmenity(amenity, isHost))}
            {isHost && (
              <TouchableOpacity
                style={styles.addAmenityButton}
                onPress={() => handleOpenAmenityModal("shared")}
              >
                <Text style={styles.addAmenityButtonText}>
                  Add Shared Amenities
                </Text>
                <Plus size={16} color={Colors.black} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Other Amenities */}
      {hasOtherAmenities && (
        <View style={styles.otherAmenities}>
          <Text style={styles.otherAmenitiesTitle}>Other Amenities:</Text>
          <Text style={styles.otherAmenitiesText}>{amenities.other}</Text>
        </View>
      )}

      {/* Modal for adding amenities */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X color={Colors.black} size={24} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedCategory
                ? `Add ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Amenities`
                : "Add Amenities"}
            </Text>
            <View style={{ width: 16 }}></View>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {toRows(modalAmenities).map((row, idx) => (
              <View key={idx} style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                {row.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity.name);
                  const Icon = amenity.icon;
                  return (
                    <TouchableOpacity
                      key={amenity.name}
                      style={[styles.typeOption, selected && styles.selectedTypeOption, { flex: 1, alignItems: "center", justifyContent: "center" }]}
                      activeOpacity={0.85}
                      onPress={() => handleAmenitySelect(amenity.name)}
                    >
                      <View style={{ marginBottom: 8 }}>
                        <Icon width={32} height={32} />
                      </View>
                      <Text style={styles.labelText}>{amenity.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Footer: Save / Cancel */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => {
                // revert selection and close
                setSelectedAmenities(initialSelectedAmenities);
                setModalVisible(false);
              }}
            >
              <Text style={[styles.modalButtonText, styles.modalCancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  amenitiesSection: {
    marginBottom: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
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
  modalSubTitle: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
    color: Colors.gray900,
    marginBottom: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.white,
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: Colors.gray100,
  },
  modalCancelButtonText: {
    color: Colors.gray700,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
  },
  otherAmenities: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
  },
  removeAmenityButton: {
    height: 30,
    width: 30,
    backgroundColor: Colors.gray200,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  otherAmenitiesTitle: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.black,
    marginBottom: 4,
  },
  addAmenityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  addAmenityButtonText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
  },
  otherAmenitiesText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  // Modal amenity grid styles (from Step6.jsx)
  typeOption: {
    backgroundColor: Colors.gray50,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 4,
  },
  selectedTypeOption: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  labelText: {
    fontSize: 13,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
    textAlign: "center",
  },
});

export default AmenitiesSection;
