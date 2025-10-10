import { Colors } from "@/constants/Colors";
import { Building2, Calendar } from "lucide-react-native";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function HostedTabSelector({ activeTab, onTabChange }) {
  return (
    <View style={styles.tabSelector}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === "apartments" && styles.activeTab]}
        onPress={() => onTabChange("apartments")}
      >
        <Building2 size={20} color={activeTab === "apartments" ? Colors.primary : Colors.gray500} />
        <Text style={[
          styles.tabText, 
          activeTab === "apartments" && styles.activeTabText
        ]}>
          Apartments
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === "events" && styles.activeTab]}
        onPress={() => onTabChange("events")}
      >
        <Calendar size={20} color={activeTab === "events" ? Colors.primary : Colors.gray500} />
        <Text style={[
          styles.tabText, 
          activeTab === "events" && styles.activeTabText
        ]}>
          Events
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