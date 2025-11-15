import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const SkeletonLoader = ({ width, height, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ApartmentCardSkeleton = () => {
  return (
    <View style={styles.apartmentCard}>
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.apartmentContent}>
        <View style={styles.apartmentHeader}>
          <View style={styles.apartmentTitleRow}>
            <SkeletonLoader width="60%" height={20} />
            <SkeletonLoader width={80} height={24} borderRadius={6} />
          </View>
          <SkeletonLoader width="50%" height={16} style={{ marginTop: 8 }} />
        </View>

        <View style={styles.apartmentStats}>
          <SkeletonLoader width={80} height={16} />
          <SkeletonLoader width={100} height={16} />
          <SkeletonLoader width={90} height={16} />
        </View>

        <View style={styles.apartmentFooter}>
          <View style={styles.footerLeftSection}>
            <SkeletonLoader width={120} height={16} style={{ marginBottom: 4 }} />
            <SkeletonLoader width={100} height={14} />
          </View>
          <SkeletonLoader width={60} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

export const EventCardSkeleton = () => {
  return (
    <View style={styles.eventCard}>
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <SkeletonLoader width="65%" height={20} />
            <SkeletonLoader width={70} height={24} borderRadius={6} />
          </View>
          <SkeletonLoader width="45%" height={16} style={{ marginTop: 8 }} />
        </View>

        <View style={styles.eventStats}>
          <SkeletonLoader width={90} height={16} />
          <SkeletonLoader width={110} height={16} />
          <SkeletonLoader width={100} height={16} />
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.footerLeftSection}>
            <SkeletonLoader width={130} height={16} style={{ marginBottom: 4 }} />
            <SkeletonLoader width={110} height={14} />
          </View>
          <SkeletonLoader width={60} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

export const LoadingSkeleton = ({ type = "apartment", count = 3 }) => {
  return (
    <View style={styles.loadingContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {type === "apartment" ? (
            <ApartmentCardSkeleton />
          ) : (
            <EventCardSkeleton />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.gray200,
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  apartmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  apartmentContent: {
    padding: 16,
  },
  eventContent: {
    padding: 16,
  },
  apartmentHeader: {
    marginBottom: 12,
  },
  eventHeader: {
    marginBottom: 12,
  },
  apartmentTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  apartmentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  eventStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  apartmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeftSection: {
    flex: 1,
  },
});

export default SkeletonLoader;
