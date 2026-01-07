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
      {/* Image skeleton - 160px height to match actual card */}
      <SkeletonLoader width="100%" height={160} borderRadius={12} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
      
      {/* Content below image */}
      <View style={styles.apartmentContent}>
        {/* Title */}
        <SkeletonLoader width="70%" height={14} style={{ marginBottom: 4 }} />
        
        {/* Price */}
        <SkeletonLoader width="45%" height={14} style={{ marginBottom: 8 }} />
        
        {/* Location row with icon space */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <SkeletonLoader width={14} height={14} borderRadius={2} style={{ marginRight: 4 }} />
          <SkeletonLoader width="65%" height={12} />
        </View>
        
        {/* Availability row with icon space */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SkeletonLoader width={14} height={14} borderRadius={2} style={{ marginRight: 4 }} />
          <SkeletonLoader width="80%" height={12} />
        </View>
      </View>
    </View>
  );
};

export const EventCardSkeleton = () => {
  return (
    <View style={styles.eventCard}>
      {/* Image skeleton - 160px height to match actual card */}
      <SkeletonLoader width="100%" height={160} borderRadius={12} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
      
      {/* Content below image */}
      <View style={styles.eventContent}>
        {/* Title */}
        <SkeletonLoader width="75%" height={14} style={{ marginBottom: 4 }} />
        
        {/* Price */}
        <SkeletonLoader width="50%" height={14} style={{ marginBottom: 8 }} />
        
        {/* Location row with icon space */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <SkeletonLoader width={14} height={14} borderRadius={2} style={{ marginRight: 4 }} />
          <SkeletonLoader width="70%" height={12} />
        </View>
        
        {/* Schedule row with icon space */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SkeletonLoader width={14} height={14} borderRadius={2} style={{ marginRight: 4 }} />
          <SkeletonLoader width="75%" height={12} />
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
  },
  apartmentContent: {
    padding: 12,
  },
  eventContent: {
    padding: 12,
  },
});

export default SkeletonLoader;
