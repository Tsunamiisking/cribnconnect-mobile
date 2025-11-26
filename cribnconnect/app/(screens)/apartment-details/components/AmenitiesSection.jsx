import { Colors } from "@/constants/Colors";
import { X, Plus  } from "lucide-react-native";
import {React, useState} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";

const AmenitiesSection = ({ amenities, amenityIcons, isHost = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderAmenity = (amenityName, isHost) => {
    const IconComponent = amenityIcons[amenityName];
    return (
      <View key={amenityName} style={styles.amenityItem}>
        {IconComponent && <IconComponent width={24} height={24} />}
        <Text style={styles.amenityText}>{amenityName}</Text>
        {isHost && (
          <TouchableOpacity
            style={styles.removeAmenityButton}
          >
            <X size={16} color={Colors.black} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderAmenityModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible} // Control visibility with state
        onRequestClose={() => { setModalVisible(false); }}
      >
        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>

        </TouchableOpacity>
      </Modal>
    )
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
              <TouchableOpacity style={styles.addAmenityButton} onPress={() => { renderAmenityModal('basic') }}>
                <Text style={styles.addAmenityButtonText}>Add Basic Amenities</Text>
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
              <TouchableOpacity style={styles.addAmenityButton}>
                <Text style={styles.addAmenityButtonText}>Add Luxury Amenities</Text>
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
              <TouchableOpacity style={styles.addAmenityButton}>
                <Text style={styles.addAmenityButtonText}>Add Shared Amenities</Text>
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
});

export default AmenitiesSection;
