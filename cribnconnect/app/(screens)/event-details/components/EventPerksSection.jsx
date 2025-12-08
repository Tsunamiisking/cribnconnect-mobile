import api from '@/api/api';
import { Colors } from '@/constants/Colors';
import {
  Badge,
  Beer,
  Bus,
  Camera,
  Car,
  Cookie,
  Crown,
  Edit,
  Gamepad,
  Gift,
  Heart,
  Lock,
  Mic,
  Moon,
  Music,
  Share,
  Shield,
  Sofa,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wind,
  Wifi,
  Wine,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

const EventPerksSection = ({ event, isHost, onPerksUpdate }) => {
  const [showEditPerksModal, setShowEditPerksModal] = useState(false);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [initialPerks, setInitialPerks] = useState([]);

  // Event perks icons mapping
  const eventPerksIcons = {
    // Entertainment
    live_music: Music,
    live_dj: Zap,
    mc_host: Mic,
    photo_booth: Camera,
    games: Gamepad,
    performances: Star,

    // Food & Drink
    catering: Utensils,
    open_bar: Wine,
    snacks_pastries: Cookie,
    welcome_drinks: Gift,
    bottle_service: Beer,

    // Experience
    vip_access: Crown,
    afterparty: Moon,
    meet_greet: Users,
    exclusive_content: Sparkles,
    networking: Share,

    // Comfort & Convenience
    wifi: Wifi,
    parking: Car,
    shuttle: Bus,
    ac: Wind,
    first_aid: Heart,
    rest_areas: Sofa,

    // Security & Logistics
    security_team: Shield,
    id_check: Badge,
    bag_check: Lock,
    crowd_control: Users,
  };

  // Perks categories (same as EventSpecialPerks)
  const perkCategories = {
    Entertainment: [
      { id: 'live_music', name: 'Live Music', icon: Music },
      { id: 'live_dj', name: 'Live DJ / Set', icon: Zap },
      { id: 'mc_host', name: 'MC / Host', icon: Mic },
      { id: 'photo_booth', name: 'Photo Booth / Content Setup', icon: Camera },
      { id: 'games', name: 'Games & Fun Activities', icon: Gamepad },
      { id: 'performances', name: 'Guest Performances', icon: Star },
    ],
    'Food & Drink': [
      { id: 'catering', name: 'Food Catering', icon: Utensils },
      { id: 'open_bar', name: 'Open Bar', icon: Wine },
      { id: 'snacks_pastries', name: 'Snacks & Small Chops', icon: Cookie },
      { id: 'welcome_drinks', name: 'Welcome Drinks', icon: Gift },
      { id: 'bottle_service', name: 'VIP / Bottle Service', icon: Beer },
    ],
    Experience: [
      { id: 'vip_access', name: 'VIP Access', icon: Crown },
      { id: 'afterparty', name: 'Afterparty Access', icon: Moon },
      { id: 'meet_greet', name: 'Meet & Greet', icon: Users },
      {
        id: 'exclusive_content',
        name: 'Exclusive Photos / Recap',
        icon: Sparkles,
      },
      { id: 'networking', name: 'Networking Sessions', icon: Share },
    ],
    'Comfort & Convenience': [
      { id: 'wifi', name: 'Free WiFi', icon: Wifi },
      { id: 'parking', name: 'Parking Available', icon: Car },
      { id: 'shuttle', name: 'Shuttle/Transport to Venue', icon: Bus },
      { id: 'ac', name: 'AC / Climate Control', icon: Wind },
      { id: 'first_aid', name: 'On-site First Aid / Medical', icon: Heart },
      { id: 'rest_areas', name: 'Rest Area / Lounge Space', icon: Sofa },
    ],
    'Security & Logistics': [
      { id: 'security_team', name: 'Security Team Present', icon: Shield },
      { id: 'id_check', name: 'ID / Verification at Gate', icon: Badge },
      {
        id: 'bag_check',
        name: 'Bag Check & Controlled Entry',
        icon: Lock,
      },
      {
        id: 'crowd_control',
        name: 'Hostess & Crowd Management',
        icon: Users,
      },
    ],
  };

  const perkNames = {
    // Entertainment
    live_music: 'Live Music',
    live_dj: 'Live DJ / Set',
    mc_host: 'MC / Host',
    photo_booth: 'Photo Booth / Content Setup',
    games: 'Games & Fun Activities',
    performances: 'Guest Performances',

    // Food & Drink
    catering: 'Food Catering',
    open_bar: 'Open Bar',
    snacks_pastries: 'Snacks & Small Chops',
    welcome_drinks: 'Welcome Drinks',
    bottle_service: 'VIP / Bottle Service',

    // Experience
    vip_access: 'VIP Access',
    afterparty: 'Afterparty Access',
    meet_greet: 'Meet & Greet',
    exclusive_content: 'Exclusive Photos / Recap',
    networking: 'Networking Sessions',

    // Comfort & Convenience
    wifi: 'Free WiFi',
    parking: 'Parking Available',
    shuttle: 'Shuttle/Transport to Venue',
    ac: 'AC / Climate Control',
    first_aid: 'On-site First Aid / Medical',
    rest_areas: 'Rest Area / Lounge Space',

    // Security & Logistics
    security_team: 'Security Team Present',
    id_check: 'ID / Verification at Gate',
    bag_check: 'Bag Check & Controlled Entry',
    crowd_control: 'Hostess & Crowd Management',
  };

  const handleOpenPerksModal = () => {
    const currentPerks = event.eventSpecialPerks || event.specialPerks || [];
    setInitialPerks(currentPerks);
    setSelectedPerks(currentPerks);
    setShowEditPerksModal(true);
  };

  const handleTogglePerk = (perkId) => {
    setSelectedPerks((prev) =>
      prev.includes(perkId)
        ? prev.filter((id) => id !== perkId)
        : [...prev, perkId]
    );
  };

  const handleSavePerks = async () => {
    try {
      const response = await api.put(`/events/${event._id || event.id}`, {
        eventSpecialPerks: selectedPerks,
      });

      if (response.data) {
        Alert.alert('Success', 'Special perks updated successfully');
        if (onPerksUpdate) {
          onPerksUpdate({ ...event, eventSpecialPerks: selectedPerks });
        }
        setShowEditPerksModal(false);
      }
    } catch (error) {
      console.error('Error updating perks:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update special perks'
      );
    }
  };

  const renderPerk = (perkId) => {
    const IconComponent = eventPerksIcons[perkId];

    return (
      <View key={perkId} style={styles.perkItem}>
        {IconComponent && <IconComponent size={24} color={Colors.primary} />}
        <Text style={styles.perkText}>
          {perkNames[perkId] ||
            perkId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Text>
      </View>
    );
  };

  const perks = event.eventSpecialPerks || event.specialPerks || [];

  if (perks.length === 0 && !isHost) {
    return null;
  }

  return (
    <>
      <View style={styles.perksSection}>
        <Text style={styles.sectionTitle}>Special Perks</Text>
        <View style={styles.perksGrid}>
          {perks.map(renderPerk)}
          {isHost && (
            <TouchableOpacity
              style={styles.addPerkButton}
              onPress={handleOpenPerksModal}
            >
              <Text style={styles.addPerkButtonText}>
                Add/Remove Special Perks
              </Text>
              <Edit size={16} color={Colors.black} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Edit Perks Modal */}
      <Modal
        visible={showEditPerksModal}
        animationType="slide"
        onRequestClose={() => setShowEditPerksModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditPerksModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Special Perks</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSubtitle}>
              Select perks that will be available at your event
            </Text>

            {Object.entries(perkCategories).map(([categoryName, perks]) => (
              <View key={categoryName} style={styles.perkCategory}>
                <Text style={styles.perkCategoryTitle}>{categoryName}</Text>
                <View style={styles.perksGridModal}>
                  {perks.map((perk) => {
                    const isSelected = selectedPerks.includes(perk.id);
                    const IconComponent = perk.icon;

                    return (
                      <TouchableOpacity
                        key={perk.id}
                        onPress={() => handleTogglePerk(perk.id)}
                        style={[
                          styles.perkCardModal,
                          isSelected && styles.perkCardModalSelected,
                        ]}
                      >
                        <View style={styles.perkCardContent}>
                          {IconComponent && (
                            <IconComponent
                              size={24}
                              color={
                                isSelected ? Colors.white : Colors.gray600
                              }
                            />
                          )}
                          <Text
                            style={[
                              styles.perkCardTextModal,
                              isSelected && styles.perkCardTextModalSelected,
                            ]}
                          >
                            {perk.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Selected Perks Summary */}
            {selectedPerks.length > 0 && (
              <View style={styles.selectedPerksInfo}>
                <Sparkles size={18} color={Colors.primary} />
                <Text style={styles.selectedPerksText}>
                  {selectedPerks.length} perk
                  {selectedPerks.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer: Save / Cancel */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setSelectedPerks(initialPerks);
                setShowEditPerksModal(false);
              }}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSavePerks}
            >
              <Text style={styles.modalButtonTextPrimary}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  perksSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 12,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  perkText: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray700,
  },
  addPerkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.black,
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 8,
    minWidth: 200,
  },
  addPerkButtonText: {
    fontSize: 13,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: Colors.black,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 24,
    lineHeight: 20,
  },
  perkCategory: {
    marginBottom: 24,
  },
  perkCategoryTitle: {
    fontSize: 15,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
    marginBottom: 12,
  },
  perksGridModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  perkCardModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  perkCardModalSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  perkCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkCardTextModal: {
    fontSize: 13,
    fontFamily: 'Sora-Medium',
    color: Colors.gray700,
  },
  perkCardTextModalSelected: {
    color: Colors.white,
  },
  selectedPerksInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue50,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  selectedPerksText: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.primary,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: Colors.gray100,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.gray700,
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
});

export default EventPerksSection;
