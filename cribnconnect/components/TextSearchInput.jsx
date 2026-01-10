import { Colors } from "@/constants/Colors";
import { Search } from "lucide-react-native";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function TextSearchInput({ 
  placeholder, 
  value, 
  onChangeText, 
  onClear,
  editable = true
}) {
  return (
    <View style={styles.searchContainer}>
      <View style={[
        styles.searchInputContainer,
        !editable && styles.searchInputDisabled
      ]}>
        <Search size={20} color={editable ? Colors.gray500 : Colors.gray300} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={editable ? Colors.gray500 : Colors.gray300}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          editable={editable}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightBackground,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 12,
  },
  clearButton: {
    fontSize: 18,
    color: Colors.gray500,
    paddingHorizontal: 8,
  },
});