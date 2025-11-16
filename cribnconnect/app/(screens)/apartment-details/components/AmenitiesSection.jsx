import {Colors} from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AmenitiesSection = ({ amenities, amenityIcons }) => {
  const renderAmenity = (amenityName) => {
    const IconComponent = amenityIcons[amenityName];
    return (
      <View key={amenityName} style={styles.amenityItem}>
        {IconComponent && <IconComponent width={24} height={24} />}
        <Text style={styles.amenityText}>{amenityName}</Text>
      </View>
    );
  };

  // Check if there are any amenities at all
  const hasBasicAmenities = amenities.basic && amenities.basic.length > 0;
  const hasLuxuryAmenities = amenities.luxury && amenities.luxury.length > 0;
  const hasSharedAmenities = amenities.shared && amenities.shared.length > 0;
  const hasOtherAmenities = amenities.other && amenities.other.length > 0;
  
  if (!hasBasicAmenities && !hasLuxuryAmenities && !hasSharedAmenities && !hasOtherAmenities) {
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
            {amenities.basic.map(renderAmenity)}
          </View>
        </View>
      )}

      {/* Luxury Amenities */}
      {hasLuxuryAmenities && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Luxury Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.luxury.map(renderAmenity)}
          </View>
        </View>
      )}

      {/* Shared Amenities */}
      {hasSharedAmenities && (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Shared Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.shared.map(renderAmenity)}
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
    marginBottom: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
  },
  otherAmenities: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
  },
  otherAmenitiesTitle: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
    marginBottom: 4,
  },
  otherAmenitiesText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
});

export default AmenitiesSection;
