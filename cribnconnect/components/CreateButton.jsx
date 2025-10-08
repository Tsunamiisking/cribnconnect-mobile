import { Colors } from "@/constants/Colors";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function CreateButton({ 
  onPress, 
  icon: Icon, 
  title, 
  subtitle 
}) {
  return (
    <View style={styles.createSection}>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={onPress}
      >
        <Icon size={20} color={Colors.white} />
        <Text style={styles.createButtonText}>{title}</Text>
      </TouchableOpacity>
      <Text style={styles.createHint}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
    elevation: 2,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  createHint: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});