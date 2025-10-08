import { Colors } from "@/constants/Colors";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function NoResults({ 
  title, 
  message, 
  showClearButton = false, 
  onClear 
}) {
  return (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsTitle}>{title}</Text>
      <Text style={styles.noResultsText}>{message}</Text>
      {showClearButton && onClear && (
        <TouchableOpacity style={styles.clearSearchButton} onPress={onClear}>
          <Text style={styles.clearSearchButtonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
});