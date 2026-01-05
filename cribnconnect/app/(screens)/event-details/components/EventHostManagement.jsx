import api from "@/api/api";
import { updateEvent, updateEventPerks, publishEvent, draftEvent } from "@/api/services/eventServices";
import { Colors } from "@/constants/Colors";
import {
  AlertTriangle,
  Badge,
  Beer,
  Bus,
  Calendar,
  Camera,
  Car,
  Cookie,
  Crown,
  Gamepad,
  Gift,
  Heart,
  Lock,
  MapPin,
  Mic,
  Moon,
  MoreVertical,
  Music,
  Plus,
  Share,
  Shield,
  Sofa,
  Sparkles,
  Star,
  Trash2,
  Users,
  Utensils,
  Wifi,
  Wind,
  Wine,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EventHostManagement = ({
  event,
  isHost,
  onEventUpdate,
  onEventDelete,
  section = "all",
}) => {
  const [showHostMenu, setShowHostMenu] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [showEditSafetyModal, setShowEditSafetyModal] = useState(false);
  const [showEditPerksModal, setShowEditPerksModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Safety tips state
  const [safetyTips, setSafetyTips] = useState(event.eventSafetyTips || []);
  const [newTip, setNewTip] = useState("");
  const [showAddTip, setShowAddTip] = useState(false);

  // Common safety tips
  const commonSafetyTips = [
    "Please arrive 30 minutes early for security check",
    "Valid ID required for entry",
    "No outside food or beverages allowed",
    "Follow all venue safety guidelines",
    "Emergency exits are clearly marked",
    "Report any suspicious activity to security",
    "Keep personal belongings secure at all times",
    "No smoking inside the venue",
    "Follow social distancing guidelines if applicable",
    "Wear comfortable shoes for standing events",
  ];

  // Perks categories (same as EventSpecialPerks)
  const perkCategories = {
    Entertainment: [
      { id: "live_music", name: "Live Music", icon: Music },
      { id: "live_dj", name: "Live DJ / Set", icon: Zap },
      { id: "mc_host", name: "MC / Host", icon: Mic },
      { id: "photo_booth", name: "Photo Booth / Content Setup", icon: Camera },
      { id: "games", name: "Games & Fun Activities", icon: Gamepad },
      { id: "performances", name: "Guest Performances", icon: Star },
    ],
    "Food & Drink": [
      { id: "catering", name: "Food Catering", icon: Utensils },
      { id: "open_bar", name: "Open Bar", icon: Wine },
      { id: "snacks_pastries", name: "Snacks & Small Chops", icon: Cookie },
      { id: "welcome_drinks", name: "Welcome Drinks", icon: Gift },
      { id: "bottle_service", name: "VIP / Bottle Service", icon: Beer },
    ],
    Experience: [
      { id: "vip_access", name: "VIP Access", icon: Crown },
      { id: "afterparty", name: "Afterparty Access", icon: Moon },
      { id: "meet_greet", name: "Meet & Greet", icon: Users },
      {
        id: "exclusive_content",
        name: "Exclusive Photos / Recap",
        icon: Sparkles,
      },
      { id: "networking", name: "Networking Sessions", icon: Share },
    ],
    "Comfort & Convenience": [
      { id: "wifi", name: "Free WiFi", icon: Wifi },
      { id: "parking", name: "Parking Available", icon: Car },
      { id: "shuttle", name: "Shuttle/Transport to Venue", icon: Bus },
      { id: "ac", name: "AC / Climate Control", icon: Wind },
      { id: "first_aid", name: "On-site First Aid / Medical", icon: Heart },
      { id: "rest_areas", name: "Rest Area / Lounge Space", icon: Sofa },
    ],
    "Security & Logistics": [
      { id: "security_team", name: "Security Team Present", icon: Shield },
      { id: "id_check", name: "ID / Verification at Gate", icon: Badge },
      { id: "bag_check", name: "Bag Check & Controlled Entry", icon: Lock },
      { id: "crowd_control", name: "Hostess & Crowd Management", icon: Users },
    ],
  };

  // Perks state
  const [selectedPerks, setSelectedPerks] = useState(
    event.eventSpecialPerks || event.specialPerks || []
  );

  // Location state
  const [editedLocation, setEditedLocation] = useState({
    street: event.location?.street || "",
    city: event.location?.city || "",
    state: event.location?.state || "",
    zip: event.location?.zip || "",
    country: event.location?.country || "",
    venue: event.location?.venue || "",
  });

  // Date state
  const [editedDate, setEditedDate] = useState(
    event.date ? new Date(event.date).toISOString().split("T")[0] : ""
  );
  const [editedTime, setEditedTime] = useState(event.time || "");
  const [editedEndTime, setEditedEndTime] = useState(event.endTime || "");

  // Safety rules state
  const [safetyRulesText, setSafetyRulesText] = useState(
    Array.isArray(event.eventSafetyTips) ? event.eventSafetyTips.join("\n") : ""
  );

  // Sync states when event prop changes
  useEffect(() => {
    setEditedLocation({
      street: event.location?.street || "",
      city: event.location?.city || "",
      state: event.location?.state || "",
      zip: event.location?.zip || "",
      country: event.location?.country || "",
      venue: event.location?.venue || "",
    });
    setEditedDate(
      event.date ? new Date(event.date).toISOString().split("T")[0] : ""
    );
    setEditedTime(event.time || "");
    setEditedEndTime(event.endTime || "");
    setSafetyRulesText(
      Array.isArray(event.eventSafetyTips)
        ? event.eventSafetyTips.join("\n")
        : ""
    );
    setSafetyTips(event.eventSafetyTips || []);
    setSelectedPerks(event.eventSpecialPerks || event.specialPerks || []);
  }, [event]);

  const handleEditLocation = () => {
    setShowHostMenu(false);
    setShowEditLocationModal(true);
  };

  const handleEditDate = () => {
    setShowHostMenu(false);
    setShowEditDateModal(true);
  };

  const handleEditSafety = () => {
    setShowHostMenu(false);
    setShowEditSafetyModal(true);
  };

  const handleToggleAvailability = async () => {
    // Check if event is paid and has attendees with tickets
    const attendeeCount = Array.isArray(event.attendees)
      ? event.attendees.length
      : event.attendees || 0;
    const hasPaidTickets = !event.isFree && attendeeCount > 0;

    if (hasPaidTickets) {
      Alert.alert(
        "Cannot Change Availability",
        "This event cannot be marked as unavailable because attendees have purchased tickets. You can cancel the event instead.",
        [{ text: "OK" }]
      );
      return;
    }

    const newStatus = !event.isActive;
    const actionText = newStatus ? "available" : "unavailable";

    Alert.alert(
      `Mark Event as ${newStatus ? "Available" : "Unavailable"}`,
      `Are you sure you want to mark this event as ${actionText}? ${
        !newStatus
          ? "Attendees will see that this event is currently unavailable."
          : "This event will be visible and available for registration."
      }`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: `Mark as ${newStatus ? "Available" : "Unavailable"}`,
          onPress: async () => {
            try {
              setShowHostMenu(false);
              setIsSaving(true);
              
              const response = await updateEvent(event.id, {
                isActive: newStatus,
              });

              if (response) {
                Alert.alert(
                  "Success",
                  `Event marked as ${actionText} successfully`
                );
                onEventUpdate(response.event || response);
              }
            } catch (error) {
              console.error("Error updating availability:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Failed to update event availability"
              );
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const addSafetyTip = (tip) => {
    if (!tip.trim()) {
      Alert.alert('Error', 'Please enter a safety tip');
      return;
    }

    if (tip.length > 200) {
      Alert.alert('Error', 'Safety tip must be less than 200 characters');
      return;
    }

    if (safetyTips.includes(tip.trim())) {
      Alert.alert('Error', 'This safety tip has already been added');
      return;
    }

    setSafetyTips([...safetyTips, tip.trim()]);
    setNewTip("");
    setShowAddTip(false);
  };

  const removeSafetyTip = (index) => {
    setSafetyTips(safetyTips.filter((_, i) => i !== index));
  };

  const addCommonTip = (tip) => {
    addSafetyTip(tip);
  };

  const getAvailableCommonTips = () => {
    return commonSafetyTips.filter(tip => !safetyTips.includes(tip));
  };

  const togglePerk = (perkId) => {
    setSelectedPerks((prev) => {
      if (prev.includes(perkId)) {
        return prev.filter((id) => id !== perkId);
      } else {
        return [...prev, perkId];
      }
    });
  };

  const handleSavePerks = async () => {
    try {
      setIsSaving(true);

      // Use the specific perks endpoint
      const response = await updateEventPerks(
        event._id || event.id,
        selectedPerks
      );

      if (response) {
        Alert.alert("Success", "Special perks updated successfully");
        onEventUpdate(response.event || response);
        setShowEditPerksModal(false);
      }
    } catch (error) {
      console.error("Error updating perks:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update special perks"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    try {
      setIsSaving(true);

      // Validate required fields
      if (
        !editedLocation.venue ||
        !editedLocation.city ||
        !editedLocation.state
      ) {
        Alert.alert(
          "Validation Error",
          "Venue, city, and state are required fields"
        );
        setIsSaving(false);
        return;
      }

      // Use general update endpoint
      const response = await updateEvent(event.id, {
        location: editedLocation,
      });

      if (response) {
        Alert.alert("Success", "Location updated successfully");
        onEventUpdate(response.event || response);
        setShowEditLocationModal(false);
      }
    } catch (error) {
      console.error("Error updating location:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update location"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDate = async () => {
    try {
      setIsSaving(true);

      // Validate date is not in the past
      const selectedDate = new Date(editedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        Alert.alert("Validation Error", "Event date cannot be in the past");
        setIsSaving(false);
        return;
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(editedTime)) {
        Alert.alert("Validation Error", "Invalid time format. Use HH:MM");
        setIsSaving(false);
        return;
      }

      const payload = {
        date: new Date(editedDate).toISOString(),
        time: editedTime,
      };

      if (editedEndTime && timeRegex.test(editedEndTime)) {
        payload.endTime = editedEndTime;
      }

      // Use general update endpoint
      const response = await updateEvent(event.id, payload);

      if (response) {
        Alert.alert("Success", "Date and time updated successfully");
        onEventUpdate(response.event || response);
        setShowEditDateModal(false);
      }
    } catch (error) {
      console.error("Error updating date:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update date and time"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSafety = async () => {
    try {
      setIsSaving(true);

      if (safetyTips.length === 0) {
        Alert.alert(
          "Validation Error",
          "Please add at least one safety guideline"
        );
        setIsSaving(false);
        return;
      }

      // Use general update endpoint
      const response = await updateEvent(event.id, {
        eventSafetyTips: safetyTips,
      });

      if (response) {
        Alert.alert("Success", "Safety guidelines updated successfully");
        onEventUpdate(response.event || response);
        setShowEditSafetyModal(false);
      }
    } catch (error) {
      console.error("Error updating safety tips:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update safety guidelines"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // Check if event is paid and has attendees
    const attendeeCount = Array.isArray(event.attendees)
      ? event.attendees.length
      : event.attendees || 0;
    const hasPaidAttendees = !event.isFree && attendeeCount > 0;

    if (hasPaidAttendees) {
      Alert.alert(
        "Cannot Delete",
        "This event cannot be deleted because attendees have purchased tickets. You can cancel the event instead, which will trigger refunds.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Event",
      attendeeCount > 0
        ? `This event has ${attendeeCount} registered attendees. Are you sure you want to delete it?`
        : "Are you sure you want to delete this event? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/events/${event.id}`);
              Alert.alert("Success", "Event deleted successfully");
              if (onEventDelete) onEventDelete();
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete event"
              );
            }
          },
        },
      ]
    );
  };

  const handleCancelEvent = () => {
    Alert.alert(
      "Cancel Event",
      "Canceling this event will notify all attendees and process refunds for paid tickets. This action cannot be undone. Are you sure?",
      [
        {
          text: "No, Keep Event",
          style: "cancel",
        },
        {
          text: "Yes, Cancel Event",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSaving(true);
              const response = await api.put(`/events/${event.id}/cancel`);
              if (response.data) {
                Alert.alert(
                  "Event Canceled",
                  "All attendees have been notified and refunds are being processed."
                );
                onEventUpdate(response.data.event);
              }
            } catch (error) {
              console.error("Error canceling event:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to cancel event"
              );
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const handlePublishEvent = () => {
    Alert.alert(
      "Publish Event",
      "Publishing this event will make it visible to all users. Make sure all details are correct.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Publish",
          onPress: async () => {
            try {
              setIsSaving(true);
              setShowHostMenu(false);
              const response = await publishEvent(event.id || event._id);
              if (response.event) {
                Alert.alert(
                  "Event Published",
                  "Your event is now live and visible to all users!"
                );
                onEventUpdate(response.event);
              }
            } catch (error) {
              console.error("Error publishing event:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to publish event. Please ensure you have completed KYC verification for paid events."
              );
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleDraftEvent = () => {
    Alert.alert(
      "Save as Draft",
      "This will unpublish your event and save it as a draft. Users will no longer be able to see or register for it.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save as Draft",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSaving(true);
              setShowHostMenu(false);
              const response = await draftEvent(event.id || event._id);
              if (response.event) {
                Alert.alert(
                  "Saved as Draft",
                  "Your event has been unpublished and saved as a draft."
                );
                onEventUpdate(response.event);
              }
            } catch (error) {
              console.error("Error saving event as draft:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to save event as draft"
              );
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const renderModals = () => (
    <>
      {/* Host Menu Modal */}
      <Modal
        visible={showHostMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHostMenu(false)}
      >
        <TouchableOpacity
          style={styles.hostMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowHostMenu(false)}
        >
          <View style={styles.hostMenuContainer}>
            <Text style={styles.hostMenuTitle}>Manage Event</Text>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleEditLocation}
            >
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleEditDate}
            >
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Date & Time</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostMenuItem}
              onPress={handleEditSafety}
            >
              <Shield size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>
                Edit Safety Guidelines
              </Text>
            </TouchableOpacity>

            {/* Toggle Availability - Only for free events or paid events without tickets */}
            {(() => {
              const attendeeCount = Array.isArray(event.attendees)
                ? event.attendees.length
                : event.attendees || 0;
              const hasPaidTickets = !event.isFree && attendeeCount > 0;
              
              return !hasPaidTickets && (
                <TouchableOpacity
                  style={styles.hostMenuItem}
                  onPress={handleToggleAvailability}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <ActivityIndicator size="small" color={Colors.primary} />
                      <Text style={[styles.hostMenuItemText, { color: Colors.gray400 }]}>
                        Updating...
                      </Text>
                    </>
                  ) : event.isActive ? (
                    <>
                      <Lock size={20} color={Colors.warning} />
                      <Text style={[styles.hostMenuItemText, { color: Colors.warning }]}>
                        Mark as Unavailable
                      </Text>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} color={Colors.success} />
                      <Text style={[styles.hostMenuItemText, { color: Colors.success }]}>
                        Mark as Available
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })()}

            <View style={styles.hostMenuDivider} />

            {(Array.isArray(event.attendees)
              ? event.attendees.length
              : event.attendees || 0) > 0 && !event.isFree ? (
              <TouchableOpacity
                style={[styles.hostMenuItem, styles.hostMenuItemDanger]}
                onPress={handleCancelEvent}
              >
                <AlertTriangle size={20} color={Colors.warning} />
                <Text
                  style={[
                    styles.hostMenuItemText,
                    styles.hostMenuItemDangerText,
                    { color: Colors.warning },
                  ]}
                >
                  Cancel Event (Refunds)
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.hostMenuItem, styles.hostMenuItemDanger]}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={Colors.error} />
                <Text
                  style={[
                    styles.hostMenuItemText,
                    styles.hostMenuItemDangerText,
                  ]}
                >
                  Delete Event
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.hostMenuCancel}
              onPress={() => setShowHostMenu(false)}
            >
              <Text style={styles.hostMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        visible={showEditLocationModal}
        animationType="slide"
        onRequestClose={() => setShowEditLocationModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Location</Text>
            <TouchableOpacity
              onPress={() => setShowEditLocationModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Venue Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={editedLocation.venue}
                onChangeText={(text) =>
                  setEditedLocation({ ...editedLocation, venue: text })
                }
                placeholder="e.g., Sky Lounge Lagos"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={editedLocation.street}
                onChangeText={(text) =>
                  setEditedLocation({ ...editedLocation, street: text })
                }
                placeholder="e.g., 123 Manhattan Avenue"
                placeholderTextColor={Colors.gray400}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>
                  City <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={editedLocation.city}
                  onChangeText={(text) =>
                    setEditedLocation({ ...editedLocation, city: text })
                  }
                  placeholder="Lagos"
                  placeholderTextColor={Colors.gray400}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>
                  State <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={editedLocation.state}
                  onChangeText={(text) =>
                    setEditedLocation({ ...editedLocation, state: text })
                  }
                  placeholder="Lagos"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
            </View>

            <View style={[styles.inputGroup]}>
              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                style={styles.input}
                value={editedLocation.country}
                onChangeText={(text) =>
                  setEditedLocation({ ...editedLocation, country: text })
                }
                placeholder="Nigeria"
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setShowEditLocationModal(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                isSaving && styles.modalButtonDisabled,
              ]}
              onPress={handleSaveLocation}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Date Modal */}
      <Modal
        visible={showEditDateModal}
        animationType="slide"
        onRequestClose={() => setShowEditDateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Date & Time</Text>
            <TouchableOpacity
              onPress={() => setShowEditDateModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Event Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={editedDate}
                onChangeText={setEditedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.gray400}
                keyboardType="numeric"
              />
              <Text style={styles.inputHint}>Format: YYYY-MM-DD</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Start Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={editedTime}
                onChangeText={setEditedTime}
                placeholder="19:00"
                placeholderTextColor={Colors.gray400}
                keyboardType="numeric"
              />
              <Text style={styles.inputHint}>Format: HH:MM (24-hour)</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>End Time (Optional)</Text>
              <TextInput
                style={styles.input}
                value={editedEndTime}
                onChangeText={setEditedEndTime}
                placeholder="23:00"
                placeholderTextColor={Colors.gray400}
                keyboardType="numeric"
              />
              <Text style={styles.inputHint}>Format: HH:MM (24-hour)</Text>
            </View>

            <View style={styles.infoBox}>
              <AlertTriangle size={20} color={Colors.warning} />
              <Text style={styles.infoText}>
                Changing the event date will notify all registered attendees
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setShowEditDateModal(false)}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                isSaving && styles.modalButtonDisabled,
              ]}
              onPress={handleSaveDate}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Safety Modal */}
      <Modal
        visible={showEditSafetyModal}
        animationType="slide"
        onRequestClose={() => setShowEditSafetyModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditSafetyModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Safety Guidelines & Information</Text>
            {/* <View style={{ width: 40 }} /> */}
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionSubtitle}>
              Add important safety information and guidelines for your attendees
            </Text>

            {/* Current Safety Tips */}
            {safetyTips.length > 0 && (
              <View style={{ marginBottom: 24, marginTop: 24 }}>
                <Text style={styles.label}>Your Safety Guidelines</Text>
                {safetyTips.map((tip, index) => (
                  <View key={index} style={[styles.typeOption, { marginTop: 8 }]}>
                    <View style={styles.typeOptionRow}>
                      <AlertTriangle size={16} color={Colors.warning} />
                      <Text style={[styles.labelText, { flex: 1, marginLeft: 8 }]}>
                        {tip}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeSafetyTip(index)}
                        style={{
                          padding: 4,
                          backgroundColor: Colors.gray200,
                          borderRadius: 4,
                        }}
                      >
                        <X size={14} color={Colors.gray600} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Add Custom Safety Tip */}
            <View style={{ marginBottom: 24, marginTop: safetyTips.length === 0 ? 24 : 0 }}>
              <Text style={styles.label}>Add Custom Safety Tip</Text>
              {!showAddTip ? (
                <TouchableOpacity
                  onPress={() => setShowAddTip(true)}
                  style={[styles.typeOption, { backgroundColor: Colors.blue50, marginTop: 8 }]}
                >
                  <View style={styles.typeOptionRow}>
                    <Plus size={20} color={Colors.primary} />
                    <Text style={[styles.labelText, { color: Colors.primary }]}>
                      Add Custom Safety Guideline
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[styles.typeOption, styles.selectedTypeOption, { marginTop: 8 }]}>
                  <Text style={[styles.labelText, { marginBottom: 8 }]}>
                    Enter Safety Guideline
                  </Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 12, height: 80 }]}
                    placeholder="e.g., Please bring a valid ID for entry verification"
                    value={newTip}
                    onChangeText={setNewTip}
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                  />
                  <Text style={[styles.typeOptionDescription, { marginBottom: 12 }]}>
                    {newTip.length}/200 characters
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => addSafetyTip(newTip)}
                      style={{
                        flex: 1,
                        backgroundColor: Colors.primary,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>
                        Add Tip
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowAddTip(false);
                        setNewTip("");
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: Colors.gray600,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Common Safety Tips */}
            {getAvailableCommonTips().length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.label}>Quick Add Common Guidelines</Text>
                <Text style={styles.typeOptionDescription}>
                  Tap to add commonly used safety guidelines
                </Text>
                <View style={{ marginTop: 12 }}>
                  {getAvailableCommonTips().slice(0, 5).map((tip, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => addCommonTip(tip)}
                      style={[styles.typeOption, { marginBottom: 8 }]}
                    >
                      <View style={styles.typeOptionRow}>
                        <Plus size={16} color={Colors.primary} />
                        <Text style={[styles.labelText, { flex: 1, marginLeft: 8 }]}>
                          {tip}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Info Note */}
            <View style={[styles.typeOption, { backgroundColor: Colors.yellow50, borderColor: Colors.warning }]}>
              <View style={styles.typeOptionRow}>
                <AlertTriangle size={20} color={Colors.warning} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.labelText, { color: Colors.warning, marginBottom: 4 }]}>
                    Safety First
                  </Text>
                  <Text style={styles.typeOptionDescription}>
                    Clear safety guidelines help ensure a safe and enjoyable experience for all attendees.
                    These will be displayed prominently on your event page.
                  </Text>
                </View>
              </View>
            </View>

            {/* Summary */}
            {safetyTips.length > 0 && (
              <View style={{ marginTop: 16, marginBottom: 20 }}>
                <Text style={styles.typeOptionDescription}>
                  ✅ {safetyTips.length} safety guideline(s) added
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setSafetyTips(event.eventSafetyTips || []);
                setShowAddTip(false);
                setNewTip("");
                setShowEditSafetyModal(false);
              }}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                isSaving && styles.modalButtonDisabled,
              ]}
              onPress={handleSaveSafety}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Perks Modal */}
      <Modal
        visible={showEditPerksModal}
        animationType="slide"
        onRequestClose={() => setShowEditPerksModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Special Perks</Text>
            <TouchableOpacity
              onPress={() => setShowEditPerksModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.perksSectionSubtitle}>
              Select perks that will be available at your event
            </Text>

            {Object.entries(perkCategories).map(([categoryName, perks]) => (
              <View key={categoryName} style={styles.perkCategory}>
                <Text style={styles.perkCategoryTitle}>{categoryName}</Text>
                <View style={styles.perksGrid}>
                  {perks.map((perk) => {
                    const isSelected = selectedPerks.includes(perk.id);
                    const IconComponent = perk.icon;

                    return (
                      <TouchableOpacity
                        key={perk.id}
                        onPress={() => togglePerk(perk.id)}
                        style={[
                          styles.perkCard,
                          isSelected && styles.perkCardSelected,
                        ]}
                      >
                        <IconComponent
                          size={24}
                          color={isSelected ? Colors.white : Colors.primary}
                        />
                        <Text
                          style={[
                            styles.perkCardText,
                            isSelected && styles.perkCardTextSelected,
                          ]}
                        >
                          {perk.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {selectedPerks.length > 0 && (
              <View style={styles.selectedPerksInfo}>
                <Sparkles size={20} color={Colors.primary} />
                <Text style={styles.selectedPerksText}>
                  {selectedPerks.length} perk
                  {selectedPerks.length !== 1 ? "s" : ""} selected
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                // Reset to original perks on cancel
                setSelectedPerks(
                  event.eventSpecialPerks || event.specialPerks || []
                );
                setShowEditPerksModal(false);
              }}
            >
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonPrimary,
                isSaving && styles.modalButtonDisabled,
              ]}
              onPress={handleSavePerks}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.modalButtonTextPrimary}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );

  if (!isHost) return null;

  // Quick actions for specific sections
  if (section === "actions") {
    return (
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleEditLocation}
        >
          <MapPin size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleEditDate}
        >
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Date & Time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleEditSafety}
        >
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.quickActionText}>Safety</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Full host management UI
  return (
    <>
      <TouchableOpacity
        style={styles.hostButton}
        onPress={() => setShowHostMenu(true)}
      >
        <MoreVertical size={24} color={Colors.primary} />
      </TouchableOpacity>

      {renderModals()}
    </>
  );
};

const styles = StyleSheet.create({
  hostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: Colors.shadowColor,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  hostMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  hostMenuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hostMenuTitle: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    color: Colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  hostMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  hostMenuItemText: {
    fontSize: 16,
    fontFamily: "Sora-Medium",
    color: Colors.black,
  },
  hostMenuItemDanger: {},
  hostMenuItemDangerText: {
    color: Colors.error,
  },
  hostMenuDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 12,
  },
  hostMenuCancel: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  hostMenuCancelText: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray600,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    marginVertical: 16,
  },
  quickActionButton: {
    alignItems: "center",
    flex: 1,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    color: Colors.primary,
  },
  sectionSubtitle: {
    color: "#6b7280",
    fontFamily: "Sora-Regular",
    marginBottom: 12,
    flexWrap: "wrap",
    width: "100%",
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Sora-Regular",
    color: Colors.gray900,
    backgroundColor: Colors.white,
    height: 60,
    marginTop: 0,
  },
  label: {
    color: "#111827",
    fontSize: 18,
    fontFamily: "Sora-Regular",
    color: Colors.primary,
  },
  labelText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "Sora-Regular",
  },
  typeOption: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  typeOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  selectedTypeOption: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  typeOptionDescription: {
    fontSize: 14,
    marginTop: 6,
    color: Colors.gray600,
    fontFamily: "Sora-Regular",
    flexWrap: "wrap",
    width: "100%",
  },
  yellow50: {
    backgroundColor: "#fef3c7",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  inputHint: {
    fontSize: 12,
    fontFamily: "Sora-Regular",
    color: Colors.gray500,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.blue50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray700,
    marginLeft: 8,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    alignItems: "center",
  },
  modalButtonSecondary: {
    backgroundColor: Colors.gray100,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.gray700,
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.white,
  },
  perksSectionSubtitle: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    marginBottom: 24,
    lineHeight: 20,
  },
  perkCategory: {
    marginBottom: 24,
  },
  perkCategoryTitle: {
    fontSize: 16,
    fontFamily: "Sora-SemiBold",
    color: Colors.black,
    marginBottom: 12,
  },
  perksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  perkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  perkCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  perkCardText: {
    fontSize: 13,
    fontFamily: "Sora-Medium",
    color: Colors.gray700,
  },
  perkCardTextSelected: {
    color: Colors.white,
  },
  selectedPerksInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.blue50,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  selectedPerksText: {
    fontSize: 14,
    fontFamily: "Sora-Medium",
    color: Colors.primary,
  },
});

export default EventHostManagement;
