import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

const APARTMENT_DETAILS = {
  '1': {
    title: 'Modern Studio Downtown',
    price: '$1,200/month',
    location: 'Downtown, Manhattan',
    bedrooms: 'Studio',
    bathrooms: '1',
    sqft: '450',
    description: 'Beautiful modern studio apartment in the heart of downtown. Features hardwood floors, stainless steel appliances, and floor-to-ceiling windows with city views.',
    amenities: ['Gym', 'Rooftop Deck', 'Laundry', 'Doorman', 'Pet Friendly'],
  },
  '2': {
    title: 'Luxury 2BR Apartment',
    price: '$2,500/month',
    location: 'Midtown, Manhattan',
    bedrooms: '2',
    bathrooms: '2',
    sqft: '850',
    description: 'Spacious luxury apartment with modern finishes and premium amenities.',
    amenities: ['Concierge', 'Pool', 'Gym', 'Parking', 'Balcony'],
  },
};

export default function ApartmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const apartment = APARTMENT_DETAILS[id] || APARTMENT_DETAILS['1'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <ThemedText style={styles.imageText}>📷 Apartment Photos</ThemedText>
          </View>
        </View>

        {/* Basic Info */}
        <ThemedView style={styles.section}>
          <ThemedText type="title">{apartment.title}</ThemedText>
          <ThemedText style={styles.price}>{apartment.price}</ThemedText>
          <ThemedText style={styles.location}>📍 {apartment.location}</ThemedText>
        </ThemedView>

        {/* Details */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Details</ThemedText>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Bedrooms</ThemedText>
              <ThemedText style={styles.detailValue}>{apartment.bedrooms}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Bathrooms</ThemedText>
              <ThemedText style={styles.detailValue}>{apartment.bathrooms}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Square Feet</ThemedText>
              <ThemedText style={styles.detailValue}>{apartment.sqft} sq ft</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Description */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText style={styles.description}>{apartment.description}</ThemedText>
        </ThemedView>

        {/* Amenities */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Amenities</ThemedText>
          <View style={styles.amenitiesContainer}>
            {apartment.amenities.map((amenity) => (
              <View key={amenity} style={styles.amenityTag}>
                <ThemedText style={styles.amenityText}>{amenity}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.favoriteButton}>
          <ThemedText style={styles.favoriteText}>❤️ Save</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <ThemedText style={styles.contactText}>Contact Agent</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    fontSize: 18,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 5,
  },
  location: {
    color: '#666',
    marginTop: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailValue: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  description: {
    lineHeight: 22,
    marginTop: 10,
    color: '#333',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
  },
  amenityTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  amenityText: {
    color: '#1976d2',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  favoriteText: {
    fontWeight: '600',
  },
  contactButton: {
    flex: 2,
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactText: {
    color: 'white',
    fontWeight: '600',
  },
});
