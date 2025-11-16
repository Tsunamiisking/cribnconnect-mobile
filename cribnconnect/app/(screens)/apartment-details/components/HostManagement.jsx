import api from '@/api/api';
import {Colors} from '@/constants/Colors';
import {
  Calendar,
  DollarSign,
  Eye,
  MoreVertical,
  Trash2,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const HostManagement = ({ apartment, isHost, onApartmentUpdate, onApartmentDelete }) => {
  const [showHostMenu, setShowHostMenu] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [showEditAvailabilityModal, setShowEditAvailabilityModal] = useState(false);
  const [editedPricePerNight, setEditedPricePerNight] = useState(apartment.pricing?.perNight || '');
  const [editedPricePerWeek, setEditedPricePerWeek] = useState(apartment.pricing?.perWeek || '');
  const [editedPricePerMonth, setEditedPricePerMonth] = useState(apartment.pricing?.perMonth || '');
  const [editedAvailabilityFrom, setEditedAvailabilityFrom] = useState('');
  const [editedAvailabilityTo, setEditedAvailabilityTo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditPrice = () => {
    setShowHostMenu(false);
    setShowEditPriceModal(true);
  };

  const handleEditAvailability = () => {
    setShowHostMenu(false);
    setShowEditAvailabilityModal(true);
  };

  const handleSavePrice = async () => {
    setIsSaving(true);
    try {
      const response = await api.put(`/apartments/${apartment.id}/pricing`, {
        pricePerNight: parseInt(editedPricePerNight),
        pricePerWeek: editedPricePerWeek ? parseInt(editedPricePerWeek) : null,
        pricePerMonth: editedPricePerMonth ? parseInt(editedPricePerMonth) : null,
      });

      console.log('Price updated successfully:', response.data);
      
      // Update parent component
      onApartmentUpdate({
        ...apartment,
        pricing: {
          perNight: editedPricePerNight,
          perWeek: editedPricePerWeek,
          perMonth: editedPricePerMonth,
        }
      });

      Alert.alert('Success', 'Pricing updated successfully');
      setShowEditPriceModal(false);
    } catch (error) {
      console.error('Failed to update price:', error);
      Alert.alert('Error', 'Failed to update pricing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAvailability = async () => {
    setIsSaving(true);
    try {
      const response = await api.put(`/apartments/${apartment.id}/availability`, {
        from: new Date(editedAvailabilityFrom),
        to: new Date(editedAvailabilityTo),
      });

      console.log('Availability updated successfully:', response.data);
      
      Alert.alert('Success', 'Availability updated successfully');
      setShowEditAvailabilityModal(false);
    } catch (error) {
      console.error('Failed to update availability:', error);
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = () => {
    setShowHostMenu(false);
    const newStatus = !apartment.isPublished;
    Alert.alert(
      newStatus ? 'Publish Listing' : 'Unpublish Listing',
      newStatus ? 'Make this apartment visible to guests?' : 'Hide this apartment from guests?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: newStatus ? 'Publish' : 'Unpublish',
          onPress: async () => {
            try {
              const response = await api.put(`/apartments/${apartment.id}/status`, {
                isPublished: newStatus,
              });

              console.log('Publish status updated:', response.data);
              
              onApartmentUpdate({
                ...apartment,
                isPublished: newStatus,
              });

              Alert.alert('Success', `Apartment ${newStatus ? 'published' : 'unpublished'} successfully`);
            } catch (error) {
              console.error('Failed to update publish status:', error);
              Alert.alert('Error', 'Failed to update status. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteApartment = () => {
    setShowHostMenu(false);
    Alert.alert(
      'Delete Apartment',
      'Are you sure you want to delete this apartment? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/apartments/${apartment.id}`);
              console.log('Apartment deleted successfully');
              
              Alert.alert('Success', 'Apartment deleted successfully');
              onApartmentDelete();
            } catch (error) {
              console.error('Failed to delete apartment:', error);
              Alert.alert('Error', 'Failed to delete apartment. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (!isHost) {
    return null;
  }

  return (
    <>
      {/* Stats Banner */}
      <View style={styles.hostStatsBanner}>
        <View style={styles.statItem}>
          <Eye size={18} color={Colors.primary} />
          <Text style={styles.statValue}>{apartment.stats?.views || 0}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Calendar size={18} color={Colors.primary} />
          <Text style={styles.statValue}>{apartment.stats?.bookings || 0}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <DollarSign size={18} color={Colors.primary} />
          <Text style={styles.statValue}>₦{(apartment.stats?.revenue || 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Menu Button (to be placed in header) */}
      <TouchableOpacity onPress={() => setShowHostMenu(true)} style={styles.headerButton}>
        <MoreVertical size={24} color={Colors.black} />
      </TouchableOpacity>

      {/* Quick Actions Section */}
      <View style={styles.hostActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.hostActionsGrid}>
          <TouchableOpacity style={styles.hostActionCard} onPress={handleEditPrice}>
            <DollarSign size={24} color={Colors.primary} />
            <Text style={styles.hostActionText}>Edit Pricing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hostActionCard} onPress={handleEditAvailability}>
            <Calendar size={24} color={Colors.primary} />
            <Text style={styles.hostActionText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hostActionCard} onPress={handleTogglePublish}>
            <Eye size={24} color={apartment.isPublished ? Colors.success : Colors.gray500} />
            <Text style={styles.hostActionText}>
              {apartment.isPublished ? 'Published' : 'Unpublished'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <Text style={styles.hostMenuTitle}>Manage Listing</Text>
            
            <TouchableOpacity style={styles.hostMenuItem} onPress={handleEditPrice}>
              <DollarSign size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Pricing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.hostMenuItem} onPress={handleEditAvailability}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>Edit Availability</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.hostMenuItem} onPress={handleTogglePublish}>
              <Eye size={20} color={Colors.primary} />
              <Text style={styles.hostMenuItemText}>
                {apartment?.isPublished ? 'Unpublish' : 'Publish'} Listing
              </Text>
            </TouchableOpacity>
            
            <View style={styles.hostMenuDivider} />
            
            <TouchableOpacity 
              style={[styles.hostMenuItem, styles.hostMenuItemDanger]} 
              onPress={handleDeleteApartment}
            >
              <Trash2 size={20} color={Colors.error} />
              <Text style={[styles.hostMenuItemText, styles.hostMenuItemDangerText]}>
                Delete Apartment
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.hostMenuCancel}
              onPress={() => setShowHostMenu(false)}
            >
              <Text style={styles.hostMenuCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Price Modal */}
      <Modal
        visible={showEditPriceModal}
        animationType="slide"
        onRequestClose={() => setShowEditPriceModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditPriceModal(false)}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Pricing</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per Night (₦)</Text>
              <TextInput
                style={styles.input}
                value={editedPricePerNight}
                onChangeText={setEditedPricePerNight}
                keyboardType="numeric"
                placeholder="Enter price per night"
                placeholderTextColor={Colors.gray400}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per Week (₦) - Optional</Text>
              <TextInput
                style={styles.input}
                value={editedPricePerWeek}
                onChangeText={setEditedPricePerWeek}
                keyboardType="numeric"
                placeholder="Enter price per week"
                placeholderTextColor={Colors.gray400}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price per Month (₦) - Optional</Text>
              <TextInput
                style={styles.input}
                value={editedPricePerMonth}
                onChangeText={setEditedPricePerMonth}
                keyboardType="numeric"
                placeholder="Enter price per month"
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleSavePrice}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Availability Modal */}
      <Modal
        visible={showEditAvailabilityModal}
        animationType="slide"
        onRequestClose={() => setShowEditAvailabilityModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditAvailabilityModal(false)}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Availability</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Set the dates when your apartment is available for booking.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available From</Text>
              <TextInput
                style={styles.input}
                value={editedAvailabilityFrom}
                onChangeText={setEditedAvailabilityFrom}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.gray400}
              />
              <Text style={styles.inputHint}>Format: YYYY-MM-DD (e.g., 2025-01-01)</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available To</Text>
              <TextInput
                style={styles.input}
                value={editedAvailabilityTo}
                onChangeText={setEditedAvailabilityTo}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.gray400}
              />
              <Text style={styles.inputHint}>Format: YYYY-MM-DD (e.g., 2025-12-31)</Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleSaveAvailability}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hostStatsBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray300,
    marginHorizontal: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostActionsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
    marginBottom: 12,
  },
  hostActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  hostActionCard: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  hostActionText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: Colors.gray700,
    textAlign: 'center',
  },
  hostMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
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
    fontFamily: 'Sora-Bold',
    color: Colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  hostMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  hostMenuItemText: {
    fontSize: 16,
    fontFamily: 'Sora-Medium',
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
    alignItems: 'center',
  },
  hostMenuCancelText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.gray600,
  },
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
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Sora-Medium',
    color: Colors.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputHint: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: Colors.gray500,
    marginTop: 6,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.white,
  },
});

export default HostManagement;
