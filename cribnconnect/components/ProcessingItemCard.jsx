import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";

export default function ProcessingItemCard({ item, onRetry }) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'uploading':
      case 'processing':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      case 'failed':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'uploading':
        return 'cloud-upload-outline';
      case 'processing':
        return 'sync-outline';
      case 'completed':
        return 'checkmark-circle';
      case 'failed':
        return 'alert-circle';
      default:
        return 'time-outline';
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed!';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Ionicons 
              name={item.type === 'apartment' ? 'home-outline' : 'calendar-outline'} 
              size={24} 
              color={Colors.gray400} 
            />
          </View>
        )}
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Ionicons name={getStatusIcon()} size={12} color={Colors.white} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {item.title || 'New Listing'}
        </Text>
        
        {/* Location/Date */}
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle || (item.type === 'apartment' ? 'Apartment' : 'Event')}
        </Text>
        
        {/* Status Row */}
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          
          {/* Progress Bar for uploading/processing */}
          {(item.status === 'uploading' || item.status === 'processing') && (
            <>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${item.progress || 0}%`,
                      backgroundColor: getStatusColor() 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{item.progress || 0}%</Text>
            </>
          )}
          
          {/* Error Message */}
          {item.status === 'failed' && item.error && (
            <Text style={styles.errorText} numberOfLines={1}>
              {item.error}
            </Text>
          )}
        </View>
      </View>

      {/* Action Button */}
      {item.status === 'failed' && onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => onRetry(item)}
        >
          <Ionicons name="reload-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      )}
      
      {(item.status === 'uploading' || item.status === 'processing') && (
        <ActivityIndicator size="small" color={getStatusColor()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderThumbnail: {
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray600,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusText: {
    fontFamily: 'Sora-Medium',
    fontSize: 11,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
    minWidth: 60,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Sora-Medium',
    fontSize: 11,
    color: Colors.gray600,
  },
  errorText: {
    fontFamily: 'Sora-Regular',
    fontSize: 11,
    color: Colors.error,
    flex: 1,
  },
  retryButton: {
    padding: 8,
    marginLeft: 8,
  },
});
