import { Colors } from "@/constants/Colors";
import { Calendar, Users } from "lucide-react-native";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function TabSelector({ activeTab, onTabChange }) {
  return (
    <View style={styles.tabSelector}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === "people" && styles.activeTab]}
        onPress={() => onTabChange("people")}
      >
        <Users size={20} color={activeTab === "people" ? Colors.primary : Colors.gray500} />
        <Text style={[
          styles.tabText, 
          activeTab === "people" && styles.activeTabText
        ]}>
          People
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === "linkups" && styles.activeTab]}
        onPress={() => onTabChange("linkups")}
      >
        <Calendar size={20} color={activeTab === "linkups" ? Colors.primary : Colors.gray500} />
        <Text style={[
          styles.tabText, 
          activeTab === "linkups" && styles.activeTabText
        ]}>
          Linkups
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Sora-Medium',
    fontSize: 16,
    color: Colors.gray500,
  },
  activeTabText: {
    color: Colors.primary,
    fontFamily: 'Sora-SemiBold',
  },
});