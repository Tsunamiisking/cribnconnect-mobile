import { Colors } from '@/constants/Colors';
import { Bath, Bed, MapPin, Star, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ApartmentInfo = ({ apartment, apartmentTypeIcons }) => {
  const ApartmentTypeIcon = apartmentTypeIcons[apartment.apartmentType];
  
  const convertApartmentSpace = (space) => {
    switch(space) {
      case 'whole':
        return 'Whole Apartment';
      case 'private':
        return 'Private Room';      
      case 'shared':
        return 'Shared Room';
      default:
        return space;
    }
  };

  const totalBaths = 
    parseInt(apartment.rooms.privateBathIn || 0) + 
    parseInt(apartment.rooms.privateBathOut || 0) + 
    parseInt(apartment.rooms.sharedBath || 0);

  return (
    <View style={styles.infoSection}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{apartment.details.title}</Text>
          <View style={styles.typeContainer}>
            {ApartmentTypeIcon && (
              <ApartmentTypeIcon size={20} color={Colors.primary} />
            )}
            <Text style={styles.typeText}>{apartment.apartmentType}</Text>
          </View>
        </View>
        <Text style={styles.spaceType}>{convertApartmentSpace(apartment.space)}</Text>
      </View>

      {/* Location Section */}
      <View style={styles.locationSection}>
        <MapPin size={16} color={Colors.gray600} />
        <Text style={styles.locationText}>
          {apartment.location.complexName && `${apartment.location.complexName}, `}
          {apartment.location.city}, {apartment.location.state}
        </Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        {(apartment.rating > 0 || apartment.reviewCount > 0) ? (
          <>
            <Star size={16} color={Colors.amber} fill={Colors.amber} />
            <Text style={styles.ratingText}>
              {apartment.rating?.toFixed(1) || '0.0'} ({apartment.reviewCount || 0} {apartment.reviewCount === 1 ? 'review' : 'reviews'})
            </Text>
          </>
        ) : (
          <Text style={styles.noRatingText}>No ratings for this apartment</Text>
        )}
      </View>

      {/* Room Section */}
      <View style={styles.roomSection}>
        <View style={styles.roomRow}>
          <View style={styles.roomItem}>
            <Bed size={20} color={Colors.gray600} />
            <Text style={styles.roomText}>{apartment.rooms.beds} Beds</Text>
          </View>
          <View style={styles.roomItem}>
            <Users size={20} color={Colors.gray600} />
            <Text style={styles.roomText}>{apartment.rooms.rooms} Rooms</Text>
          </View>
          <View style={styles.roomItem}>
            <Bath size={20} color={Colors.gray600} />
            <Text style={styles.roomText}>{totalBaths} Baths</Text>
          </View>
          <View style={styles.roomItem}>
            <Users size={20} color={Colors.gray600} />
            <Text style={styles.roomText}>Max {apartment.maxGuests} guests</Text>
          </View>
        </View>
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
        <Text style={styles.priceText}>
          ₦{parseInt(apartment.pricing.perNight || 0).toLocaleString()}
          <Text style={styles.priceUnit}> / night</Text>
        </Text>
        {apartment.pricing.perWeek && (
          <Text style={styles.weeklyPrice}>
            ₦{parseInt(apartment.pricing.perWeek).toLocaleString()} / week
          </Text>
        )}
        {/* {apartment.pricing.perMonth && (
          <Text style={styles.weeklyPrice}>
            ₦{parseInt(apartment.pricing.perMonth).toLocaleString()} / month
          </Text>
        )} */}
      </View>

      {/* Description Section */}
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>About this space</Text>
        <Text style={styles.description}>{apartment.details.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Sora-Bold',
    color: Colors.black,
    flex: 1,
    marginRight: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  spaceType: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    flex: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
  },
  noRatingText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
    fontStyle: 'italic',
  },
  roomSection: {
    marginBottom: 20,
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  pricingSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  priceText: {
    fontSize: 28,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  weeklyPrice: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
  },
});

export default ApartmentInfo;
