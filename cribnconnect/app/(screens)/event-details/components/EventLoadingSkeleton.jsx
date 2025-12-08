import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const EventLoadingSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    shimmerLoop.start();

    return () => shimmerLoop.stop();
  }, []);

  const ShimmerView = ({ style }) => {
    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    });

    const shimmerTranslateX = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 100],
    });

    return (
      <View style={[styles.skeleton, style]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: shimmerOpacity,
              transform: [{ translateX: shimmerTranslateX }],
              backgroundColor: Colors.white,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <ShimmerView style={styles.headerButton} />
        <View style={styles.headerActions}>
          <ShimmerView style={styles.headerButton} />
          <ShimmerView style={styles.headerButton} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Media Skeleton */}
        <ShimmerView style={styles.mediaContainer} />

        {/* Content Skeleton */}
        <View style={styles.infoSection}>
          {/* Title Skeleton */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <ShimmerView style={styles.skeletonTitle} />
              <ShimmerView style={styles.skeletonCategory} />
            </View>
            <ShimmerView style={styles.skeletonSubtitle} />
          </View>

          {/* Event Details Skeleton */}
          <View style={styles.detailsSection}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.detailRow}>
                <ShimmerView style={styles.skeletonIcon} />
                <View style={styles.detailContent}>
                  <ShimmerView style={styles.skeletonDetailLabel} />
                  <ShimmerView style={styles.skeletonDetailValue} />
                </View>
              </View>
            ))}
          </View>

          {/* Description Skeleton */}
          <View style={styles.descriptionSection}>
            <ShimmerView style={styles.skeletonSectionTitle} />
            <ShimmerView style={styles.skeletonDescriptionLine} />
            <ShimmerView style={styles.skeletonDescriptionLine} />
            <ShimmerView style={styles.skeletonDescriptionLineShort} />
          </View>

          {/* Tickets Skeleton */}
          <View style={styles.ticketsSection}>
            <ShimmerView style={styles.skeletonSectionTitle} />
            {[1, 2].map((item) => (
              <ShimmerView key={item} style={styles.skeletonTicket} />
            ))}
          </View>

          {/* Perks Skeleton */}
          <View style={styles.perksSection}>
            <ShimmerView style={styles.skeletonSectionTitle} />
            <View style={styles.perksGrid}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ShimmerView key={item} style={styles.skeletonPerk} />
              ))}
            </View>
          </View>

          {/* Organizer Skeleton */}
          <View style={styles.organizerSection}>
            <ShimmerView style={styles.skeletonSectionTitle} />
            <View style={styles.organizerInfo}>
              <ShimmerView style={styles.skeletonOrganizerAvatar} />
              <View style={styles.organizerDetails}>
                <ShimmerView style={styles.skeletonOrganizerName} />
                <ShimmerView style={styles.skeletonOrganizerContact} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar Skeleton */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPricing}>
          <ShimmerView style={styles.skeletonBottomPrice} />
        </View>
        <ShimmerView style={styles.skeletonRSVPButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  skeleton: {
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaContainer: {
    width: screenWidth,
    height: 300,
    backgroundColor: Colors.gray200,
  },
  infoSection: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  skeletonTitle: {
    height: 28,
    flex: 1,
    marginRight: 16,
    borderRadius: 6,
  },
  skeletonCategory: {
    height: 32,
    width: 100,
    borderRadius: 8,
  },
  skeletonSubtitle: {
    height: 20,
    width: '60%',
    borderRadius: 4,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  skeletonIcon: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  skeletonDetailLabel: {
    height: 16,
    width: 80,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonDetailValue: {
    height: 18,
    width: '100%',
    borderRadius: 4,
    marginBottom: 4,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  skeletonSectionTitle: {
    height: 20,
    width: 150,
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonDescriptionLine: {
    height: 16,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDescriptionLineShort: {
    height: 16,
    width: '70%',
    borderRadius: 4,
  },
  ticketsSection: {
    marginBottom: 24,
  },
  skeletonTicket: {
    height: 60,
    width: '100%',
    borderRadius: 12,
    marginBottom: 12,
  },
  perksSection: {
    marginBottom: 24,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skeletonPerk: {
    height: 40,
    width: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizerInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  skeletonOrganizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  organizerDetails: {
    flex: 1,
  },
  skeletonOrganizerName: {
    height: 20,
    width: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonOrganizerContact: {
    height: 16,
    width: 100,
    borderRadius: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  bottomPricing: {
    flex: 1,
  },
  skeletonBottomPrice: {
    height: 20,
    width: 150,
    borderRadius: 4,
  },
  skeletonRSVPButton: {
    height: 48,
    width: 120,
    borderRadius: 12,
  },
});

export default EventLoadingSkeleton;
