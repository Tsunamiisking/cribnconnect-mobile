import {Colors} from '@/constants/Colors';
import { Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HostInfo = ({ houseRules }) => {
  return (
    <>
      {/* House Rules Section */}
      {houseRules && houseRules.length > 0 && (
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>House Rules</Text>
          <Text style={styles.rulesText}>{houseRules[0]}</Text>
        </View>
      )}

      {/* Host Profile Section */}
      <View style={styles.hostSection}>
        <Text style={styles.sectionTitle}>Meet your host</Text>
        <View style={styles.hostInfo}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostInitial}>JD</Text>
          </View>
          <View style={styles.hostDetails}>
            <Text style={styles.hostName}>John Doe</Text>
            <Text style={styles.hostJoined}>Joined in 2023</Text>
            <View style={styles.hostRating}>
              <Star size={14} color={Colors.amber} fill={Colors.amber} />
              <Text style={styles.hostRatingText}>4.9 (47 reviews)</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  rulesSection: {
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
    marginBottom: 12,
  },
  rulesText: {
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
    lineHeight: 24,
  },
  hostSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  hostAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInitial: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: Colors.white,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 4,
  },
  hostJoined: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 4,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostRatingText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
});

export default HostInfo;
