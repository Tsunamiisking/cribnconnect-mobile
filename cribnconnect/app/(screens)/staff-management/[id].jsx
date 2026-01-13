import { addEventStaff, getEventStaff, removeEventStaff, revokeAllStaff } from '@/api/services/ticketServices';
import BackHeader from '@/components/BackHeader';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { AlertCircle, Shield, ShieldCheck, Trash2, User, UserPlus, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StaffManagementScreen = () => {
  const { id, eventTitle, isHost } = useLocalSearchParams();
  const eventId = id; // Use id from route params
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('validator');
  const [addingStaff, setAddingStaff] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadStaff();
    }
  }, [eventId]);

  const loadStaff = async () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID is missing');
      return;
    }
    
    try {
      setLoading(true);
      const response = await getEventStaff(eventId);
      setStaff(response.staff || []);
    } catch (error) {
      console.error('Error loading staff:', error);
      Alert.alert('Error', 'Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStaff();
    setRefreshing(false);
  };

  const handleAddStaff = async () => {
    if (!searchEmail.trim()) {
      Alert.alert('Error', 'Please enter a user email');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setAddingStaff(true);
    try {
      const response = await addEventStaff(eventId, searchEmail.trim(), selectedRole);
      
      // Show success with user's actual name if available
      const staffName = response.staff?.name || searchEmail;
      Alert.alert('Success', `${staffName} has been added as a ${selectedRole}`);
      setSearchEmail('');
      loadStaff();
    } catch (error) {
      console.error('Error adding staff:', error);
      
      // Handle specific error codes from backend
      if (error.response?.status === 404) {
        Alert.alert(
          'User Not Found',
          `No user found with email: ${searchEmail.trim()}\n\nThey must sign up in the app first.`
        );
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'User is already authorized for this event';
        Alert.alert('Already Authorized', message);
      } else if (error.response?.status === 403) {
        Alert.alert('Unauthorized', 'Only the host or managers can add staff members');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add staff member';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setAddingStaff(false);
    }
  };

  const handleRemoveStaff = (staffMember) => {
    Alert.alert(
      'Remove Staff',
      `Remove ${staffMember.name} from event staff?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeEventStaff(eventId, staffMember.userId);
              Alert.alert('Success', 'Staff member removed successfully');
              loadStaff();
            } catch (error) {
              const errorMessage = error.response?.data?.message || 'Failed to remove staff member';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleRevokeAllStaff = () => {
    if (!isHost || isHost === 'false') {
      Alert.alert('Unauthorized', 'Only the event host can revoke all staff access');
      return;
    }

    Alert.alert(
      '⚠️ Revoke All Staff Access',
      `This will immediately remove ALL ${staff.length} staff members from this event. This action cannot be undone.\n\nAre you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke All',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await revokeAllStaff(eventId);
              Alert.alert(
                'Success',
                `All staff access revoked. ${response.removedCount} members removed.`
              );
              loadStaff();
            } catch (error) {
              const errorMessage = error.response?.data?.message || 'Failed to revoke staff access';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const renderStaffItem = ({ item }) => (
    <View style={styles.staffCard}>
      <View style={styles.staffInfo}>
        <View style={styles.staffHeader}>
          <User size={20} color={Colors.primary} />
          <Text style={styles.staffName}>{item.name}</Text>
        </View>
        <Text style={styles.staffEmail}>{item.email}</Text>
        
        <View style={styles.staffMeta}>
          <View style={[
            styles.roleBadge,
            item.role === 'manager' ? styles.managerBadge : styles.validatorBadge
          ]}>
            {item.role === 'manager' ? (
              <ShieldCheck size={14} color={Colors.white} />
            ) : (
              <Shield size={14} color={Colors.white} />
            )}
            <Text style={styles.roleBadgeText}>
              {item.role === 'manager' ? 'Manager' : 'Validator'}
            </Text>
          </View>
          <Text style={styles.addedText}>
            Added {new Date(item.addedAt).toLocaleDateString()}
          </Text>
        </View>
        
        {item.addedBy && (
          <Text style={styles.addedByText}>by {item.addedBy}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveStaff(item)}
      >
        <Trash2 size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Users size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>No Staff Members</Text>
      <Text style={styles.emptyStateText}>
        Add validators and managers to help you scan tickets and manage the event.
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Staff Management" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading staff...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={`Staff - ${eventTitle || 'Event'}`} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <AlertCircle size={20} color={Colors.primary} />
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>Staff Roles</Text>
            <Text style={styles.infoBannerDesc}>
              <Text style={styles.boldText}>Validators</Text> can scan tickets. {'\n'}
              <Text style={styles.boldText}>Managers</Text> can scan tickets and add validators.
            </Text>
          </View>
        </View>

        {/* Add Staff Section */}
        <View style={styles.addSection}>
          <View style={styles.addSectionHeader}>
            <UserPlus size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Add Staff Member</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter user email"
            placeholderTextColor={Colors.gray400}
            value={searchEmail}
            onChangeText={setSearchEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'validator' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('validator')}
            >
              <Shield size={18} color={selectedRole === 'validator' ? Colors.white : Colors.primary} />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'validator' && styles.roleButtonTextActive,
                ]}
              >
                Validator
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'manager' && styles.roleButtonActive,
              ]}
              onPress={() => setSelectedRole('manager')}
            >
              <ShieldCheck size={18} color={selectedRole === 'manager' ? Colors.white : Colors.primary} />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'manager' && styles.roleButtonTextActive,
                ]}
              >
                Manager
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addButton, addingStaff && styles.addButtonDisabled]}
            onPress={handleAddStaff}
            disabled={addingStaff}
          >
            {addingStaff ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <UserPlus size={20} color={Colors.white} />
                <Text style={styles.addButtonText}>Add Staff</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Current Staff List */}
        <View style={styles.staffListSection}>
          <View style={styles.staffListHeader}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Current Staff ({staff.length})</Text>
          </View>

          {staff.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {staff.map((item) => (
                <View key={item.userId}>
                  {renderStaffItem({ item })}
                </View>
              ))}
            </>
          )}
        </View>

        {/* Emergency Revoke All (Host Only) - At Bottom */}
        {isHost === 'true' && staff.length > 0 && (
          <View style={styles.emergencySection}>
            <View style={styles.emergencySectionHeader}>
              <AlertCircle size={20} color={Colors.error} />
              <Text style={styles.emergencySectionTitle}>Emergency Controls</Text>
            </View>
            <TouchableOpacity
              style={styles.revokeAllButton}
              onPress={handleRevokeAllStaff}
            >
              <Trash2 size={20} color={Colors.white} />
              <Text style={styles.revokeAllButtonText}>
                Revoke All Staff Access ({staff.length})
              </Text>
            </TouchableOpacity>
            <Text style={styles.warningText}>
              ⚠️ This will immediately remove all staff members
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sora-Regular',
    fontSize: 16,
    color: Colors.gray600,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.blue50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.blue500,
  },
  infoBannerText: {
    flex: 1,
    marginLeft: 12,
  },
  infoBannerTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    marginBottom: 4,
  },
  infoBannerDesc: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray700,
    lineHeight: 18,
  },
  boldText: {
    fontFamily: 'Sora-SemiBold',
  },
  addSection: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  addSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 10,
    padding: 14,
    fontFamily: 'Sora-Regular',
    fontSize: 15,
    color: Colors.gray900,
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  roleButtonTextActive: {
    color: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  emergencySection: {
    backgroundColor: Colors.red50,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  emergencySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencySectionTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
  revokeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  revokeAllButtonText: {
    fontFamily: 'Sora-Bold',
    fontSize: 15,
    color: Colors.white,
  },
  warningText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 12,
    color: Colors.error,
    textAlign: 'center',
  },
  staffListSection: {
    marginBottom: 16,
  },
  staffListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  staffInfo: {
    flex: 1,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  staffName: {
    fontFamily: 'Sora-Bold',
    fontSize: 16,
    color: Colors.gray900,
    marginLeft: 8,
  },
  staffEmail: {
    fontFamily: 'Sora-Regular',
    fontSize: 13,
    color: Colors.gray600,
    marginBottom: 8,
  },
  staffMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  validatorBadge: {
    backgroundColor: Colors.primary,
  },
  managerBadge: {
    backgroundColor: Colors.success,
  },
  roleBadgeText: {
    fontFamily: 'Sora-Bold',
    fontSize: 11,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  addedText: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
  addedByText: {
    fontFamily: 'Sora-Regular',
    fontSize: 11,
    color: Colors.gray500,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'Sora-Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Sora-Regular',
    fontSize: 14,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StaffManagementScreen;