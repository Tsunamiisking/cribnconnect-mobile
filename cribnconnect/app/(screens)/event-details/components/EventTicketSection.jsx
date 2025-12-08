import { updateEventTickets } from '@/api/services/eventServices';
import { Colors } from '@/constants/Colors';
import { Edit, Plus, X } from 'lucide-react-native';
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

const EventTicketSection = ({ event, isHost, onTicketUpdate, formatPrice }) => {
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [isFree, setIsFree] = useState(event.isFree || false);
  const [ticketTypes, setTicketTypes] = useState(event.ticketTypes || []);
  const [capacity, setCapacity] = useState(event.capacity?.toString() || '');
  const [showCustomTicket, setShowCustomTicket] = useState(false);
  const [customTicketName, setCustomTicketName] = useState('');
  const [customTicketPrice, setCustomTicketPrice] = useState('');
  const [customTicketQuantity, setCustomTicketQuantity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Predefined ticket types
  const predefinedTypes = [
    { id: 'regular', name: 'Regular', price: '', quantity: '' },
    { id: 'vip', name: 'VIP', price: '', quantity: '' },
    { id: 'vvip', name: 'VVIP', price: '', quantity: '' },
  ];

  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return '';
    const num = parseFloat(amount.toString().replace(/,/g, ''));
    return `₦${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePriceChange = (value) => {
    return value.replace(/[^0-9.]/g, '');
  };

  const handleQuantityChange = (value) => {
    return value.replace(/[^0-9]/g, '');
  };

  const handleOpenTicketModal = () => {
    setIsFree(event.isFree || false);
    // Ensure all ticket types have unique ids and convert price/quantity to strings
    const ticketsWithIds = (event.ticketTypes || []).map((ticket, index) => {
      // Check if this is a predefined ticket type by name and assign correct id
      let ticketId = ticket.id || ticket._id;
      const ticketNameLower = ticket.name?.toLowerCase();
      
      if (ticketNameLower === 'regular' && !ticketId) {
        ticketId = 'regular';
      } else if (ticketNameLower === 'vip' && !ticketId) {
        ticketId = 'vip';
      } else if (ticketNameLower === 'vvip' && !ticketId) {
        ticketId = 'vvip';
      } else if (!ticketId) {
        ticketId = `ticket_${index}_${Date.now()}`;
      }
      
      return {
        ...ticket,
        id: ticketId,
        price: ticket.price?.toString() || '',
        quantity: ticket.quantity?.toString() || '',
      };
    });
    setTicketTypes(ticketsWithIds);
    setCapacity(event.capacity?.toString() || '');
    setShowEditTicketModal(true);
  };

  const toggleFree = () => {
    const newIsFree = !isFree;
    setIsFree(newIsFree);
    if (newIsFree) {
      setTicketTypes([]);
    }
  };

  const addPredefinedTicket = (typeId) => {
    const type = predefinedTypes.find((t) => t.id === typeId);
    if (type && !ticketTypes.find((t) => t.id === typeId)) {
      setTicketTypes((prev) => [
        ...prev,
        {
          ...type,
          price: '',
          quantity: '',
          isActive: true,
        },
      ]);
    }
  };

  const addCustomTicket = () => {
    if (!customTicketName.trim()) {
      Alert.alert('Error', 'Please enter a ticket type name');
      return;
    }

    if (!customTicketPrice || parseFloat(customTicketPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!customTicketQuantity || parseInt(customTicketQuantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity (at least 1)');
      return;
    }

    const customId = `custom_${Date.now()}`;
    const newTicket = {
      id: customId,
      name: customTicketName.trim(),
      price: customTicketPrice,
      quantity: customTicketQuantity,
      isActive: true,
    };

    const updatedTickets = [...ticketTypes, newTicket];
    setTicketTypes(updatedTickets);
    
    // Update capacity based on total tickets
    const totalQuantity = updatedTickets.reduce(
      (sum, t) => sum + (parseInt(t.quantity) || 0),
      0
    );
    if (totalQuantity > 0) {
      setCapacity(totalQuantity.toString());
    }
    
    setCustomTicketName('');
    setCustomTicketPrice('');
    setCustomTicketQuantity('');
    setShowCustomTicket(false);
  };

  const removeTicket = (ticketId) => {
    const updatedTickets = ticketTypes.filter((t) => t.id !== ticketId);
    setTicketTypes(updatedTickets);
    
    // Update capacity based on remaining tickets
    const totalQuantity = updatedTickets.reduce(
      (sum, t) => sum + (parseInt(t.quantity) || 0),
      0
    );
    setCapacity(totalQuantity > 0 ? totalQuantity.toString() : '');
  };

  const updateTicketPrice = (ticketId, price) => {
    setTicketTypes((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, price: handlePriceChange(price) }
          : ticket
      )
    );
  };

  const updateTicketQuantity = (ticketId, quantity) => {
    const updatedTickets = ticketTypes.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, quantity: handleQuantityChange(quantity) }
        : ticket
    );
    setTicketTypes(updatedTickets);
    
    // Update capacity based on total tickets
    const totalQuantity = updatedTickets.reduce(
      (sum, t) => sum + (parseInt(t.quantity) || 0),
      0
    );
    if (totalQuantity > 0) {
      setCapacity(totalQuantity.toString());
    }
  };

  const getAvailablePredefinedTypes = () => {
    return predefinedTypes.filter(
      (type) => !ticketTypes.find((ticket) => ticket.id === type.id)
    );
  };

  const handleSaveTickets = async () => {
    if (isSaving) return; // Prevent multiple clicks
    
    try {
      // Validate capacity
      if (!capacity || parseInt(capacity) <= 0) {
        Alert.alert('Error', 'Please enter a valid event capacity');
        return;
      }

      // Validate ticket types if not free
      if (!isFree) {
        if (ticketTypes.length === 0) {
          Alert.alert(
            'Error',
            'Please add at least one ticket type or mark event as free'
          );
          return;
        }

        // Validate each ticket has price and quantity
        const incompleteTickets = ticketTypes.filter(
          (t) =>
            !t.price ||
            parseFloat(t.price) <= 0 ||
            !t.quantity ||
            parseInt(t.quantity) <= 0
        );

        if (incompleteTickets.length > 0) {
          Alert.alert(
            'Error',
            'Please complete all ticket types with valid price and quantity'
          );
          return;
        }
      }

      setIsSaving(true);

      const payload = {
        isFree,
        capacity: parseInt(capacity),
        ticketTypes: isFree ? [] : ticketTypes,
      };

      // Use the specific tickets endpoint
      const response = await updateEventTickets(event._id || event.id, payload);

      if (response) {
        Alert.alert('Success', 'Ticket information updated successfully');
        if (onTicketUpdate) {
          onTicketUpdate({
            ...event,
            isFree,
            capacity: parseInt(capacity),
            ticketTypes: isFree ? [] : ticketTypes,
          });
        }
        setShowEditTicketModal(false);
      }
    } catch (error) {
      console.error('Error updating tickets:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update ticket information'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderTicketDisplay = () => {
    if (event.isFree) {
      return (
        <View style={styles.ticketItem}>
          <Text style={styles.ticketName}>Free Event</Text>
          <Text style={styles.ticketPrice}>₦0.00</Text>
        </View>
      );
    }

    if (!event.ticketTypes || event.ticketTypes.length === 0) {
      return (
        <View style={styles.ticketItem}>
          <Text style={styles.ticketName}>No tickets available</Text>
        </View>
      );
    }

    return event.ticketTypes.map((ticket, index) => (
      <View key={ticket.id || index} style={styles.ticketItem}>
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketName}>{ticket.name}</Text>
          <Text style={styles.ticketPrice}>{formatPrice(ticket.price)}</Text>
        </View>
        {ticket.quantity && (
          <Text style={styles.ticketQuantity}>
            {ticket.quantity} tickets available
          </Text>
        )}
      </View>
    ));
  };

  return (
    <>
      <View style={styles.ticketsSection}>
        <Text style={styles.sectionTitle}>Ticket Information</Text>
        {renderTicketDisplay()}
        
        {/* Capacity Display
        <View style={[styles.ticketItem, { marginTop: 8 }]}>
          <Text style={styles.ticketName}>Event Capacity</Text>
          <Text style={styles.ticketPrice}>{event.capacity} people</Text>
        </View> */}

        {isHost && (
          <TouchableOpacity
            style={styles.editTicketButton}
            onPress={handleOpenTicketModal}
          >
            <Text style={styles.editTicketButtonText}>Edit Ticket Types</Text>
            <Edit size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Ticket Modal */}
      <Modal
        visible={showEditTicketModal}
        animationType="slide"
        onRequestClose={() => setShowEditTicketModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowEditTicketModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Ticket Information</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSubtitle}>
              Update ticket types and event capacity
            </Text>

            {/* Capacity Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.label}>Event Capacity *</Text>
              <TextInput
                style={styles.input}
                placeholder="Maximum number of attendees"
                value={capacity}
                onChangeText={(value) => setCapacity(handleQuantityChange(value))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            {/* Free Event Toggle */}
            <TouchableOpacity
              onPress={toggleFree}
              style={[styles.typeOption, isFree && styles.selectedTypeOption]}
            >
              <Text
                style={[
                  styles.labelText,
                  isFree && styles.selectedTypeOptionText,
                ]}
              >
                Free Event (No ticket price)
              </Text>
            </TouchableOpacity>

            {/* Paid Event Section */}
            {!isFree && (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.label}>Ticket Types</Text>
                <Text style={styles.typeOptionDescription}>
                  Add different ticket types with their respective prices
                </Text>

                {/* Existing Ticket Types */}
                {ticketTypes.map((ticket) => (
                  <View
                    key={ticket.id}
                    style={[styles.typeOption, { marginTop: 12 }]}
                  >
                    <View style={styles.typeOptionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.labelText}>{ticket.name}</Text>

                        {/* Price Input */}
                        <View style={{ marginTop: 8 }}>
                          <Text
                            style={[
                              styles.typeOptionDescription,
                              { marginBottom: 4 },
                            ]}
                          >
                            Price (₦)
                          </Text>
                          <TextInput
                            style={[styles.input, { height: 45 }]}
                            placeholder="Enter price"
                            keyboardType="numeric"
                            value={ticket.price}
                            onChangeText={(value) =>
                              updateTicketPrice(ticket.id, value)
                            }
                          />
                        </View>

                        {/* Quantity Input */}
                        <View style={{ marginTop: 8 }}>
                          <Text
                            style={[
                              styles.typeOptionDescription,
                              { marginBottom: 4 },
                            ]}
                          >
                            Available Tickets
                          </Text>
                          <TextInput
                            style={[styles.input, { height: 45 }]}
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={ticket.quantity}
                            onChangeText={(value) =>
                              updateTicketQuantity(ticket.id, value)
                            }
                          />
                        </View>

                        {/* Display Summary */}
                        <Text
                          style={[
                            styles.typeOptionDescription,
                            { marginTop: 8 },
                          ]}
                        >
                          {ticket.price && ticket.quantity
                            ? `${formatNaira(ticket.price)} • ${
                                ticket.quantity
                              } tickets available`
                            : 'Complete price and quantity'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeTicket(ticket.id)}
                        style={{
                          padding: 8,
                          backgroundColor: Colors.warning,
                          borderRadius: 6,
                          marginLeft: 12,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                {/* Add Predefined Ticket Types */}
                {getAvailablePredefinedTypes().length > 0 && (
                  <View style={{ marginTop: 16 }}>
                    <View style={styles.verticalOptions}>
                      {getAvailablePredefinedTypes().map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          onPress={() => addPredefinedTicket(type.id)}
                          style={styles.typeOption}
                        >
                          <View style={styles.typeOptionRow}>
                            <Plus size={20} color={Colors.primary} />
                            <Text style={styles.labelText}>
                              Add {type.name} Ticket
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Custom Ticket Type */}
                <View style={{ marginTop: 16 }}>
                  {!showCustomTicket ? (
                    <TouchableOpacity
                      onPress={() => setShowCustomTicket(true)}
                      style={styles.typeOption}
                    >
                      <View style={styles.typeOptionRow}>
                        <Plus size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>
                          Add Custom Ticket Type
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[styles.typeOption, styles.selectedTypeOption]}
                    >
                      <Text style={styles.label}>Custom Ticket Type</Text>

                      {/* Ticket Name */}
                      <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="Enter ticket type name (e.g., Early Bird, Student)"
                        value={customTicketName}
                        onChangeText={setCustomTicketName}
                      />

                      {/* Price */}
                      <View style={{ marginTop: 8 }}>
                        <Text
                          style={[
                            styles.typeOptionDescription,
                            { marginBottom: 4 },
                          ]}
                        >
                          Price (₦)
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter price"
                          keyboardType="numeric"
                          value={customTicketPrice}
                          onChangeText={(value) =>
                            setCustomTicketPrice(handlePriceChange(value))
                          }
                        />
                      </View>

                      {/* Quantity */}
                      <View style={{ marginTop: 8 }}>
                        <Text
                          style={[
                            styles.typeOptionDescription,
                            { marginBottom: 4 },
                          ]}
                        >
                          Available Tickets
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter quantity"
                          keyboardType="numeric"
                          value={customTicketQuantity}
                          onChangeText={(value) =>
                            setCustomTicketQuantity(handleQuantityChange(value))
                          }
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 12,
                          gap: 8,
                        }}
                      >
                        <TouchableOpacity
                          onPress={addCustomTicket}
                          style={{
                            flex: 1,
                            backgroundColor: Colors.primary,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Sora-SemiBold',
                            }}
                          >
                            Add Ticket
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setShowCustomTicket(false);
                            setCustomTicketName('');
                            setCustomTicketPrice('');
                            setCustomTicketQuantity('');
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: Colors.gray600,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Sora-SemiBold',
                            }}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Ticket Summary */}
                {ticketTypes.length > 0 && (
                  <View
                    style={[
                      styles.typeOption,
                      { marginTop: 16, backgroundColor: Colors.blue50 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.labelText,
                        { color: Colors.primary, marginBottom: 8 },
                      ]}
                    >
                      Ticket Summary ({ticketTypes.length} types)
                    </Text>
                    {ticketTypes.map((ticket) => {
                      const hasPrice =
                        ticket.price && parseFloat(ticket.price) > 0;
                      const hasQuantity =
                        ticket.quantity && parseInt(ticket.quantity) > 0;
                      const isComplete = hasPrice && hasQuantity;

                      return (
                        <Text
                          key={ticket.id}
                          style={styles.typeOptionDescription}
                        >
                          • {ticket.name}:{' '}
                          {isComplete
                            ? `${formatNaira(ticket.price)} • ${
                                ticket.quantity
                              } tickets`
                            : '⚠️ Incomplete (add price & quantity)'}
                        </Text>
                      );
                    })}

                    {/* Total Tickets Available */}
                    {ticketTypes.some((t) => t.quantity) && (
                      <Text
                        style={[
                          styles.typeOptionDescription,
                          { marginTop: 8, fontFamily: 'Sora-SemiBold' },
                        ]}
                      >
                        Total Tickets:{' '}
                        {ticketTypes.reduce(
                          (sum, t) => sum + (parseInt(t.quantity) || 0),
                          0
                        )}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Display Current Selection */}
            <View style={{ marginTop: 16, marginBottom: 20 }}>
              <Text style={styles.typeOptionDescription}>
                Event Type:{' '}
                {isFree
                  ? 'Free Event'
                  : `Paid Event - ${ticketTypes.length} ticket type(s)`}
              </Text>
            </View>
          </ScrollView>

          {/* Footer: Save / Cancel */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setIsFree(event.isFree || false);
                setTicketTypes(event.ticketTypes || []);
                setCapacity(event.capacity?.toString() || '');
                setShowEditTicketModal(false);
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
              onPress={handleSaveTickets}
              disabled={isSaving}
            >
              <Text style={styles.modalButtonTextPrimary}>
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
  ticketsSection: {
    paddingHorizontal: 20,
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
  ticketItem: {
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketName: {
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    color: Colors.black,
  },
  ticketPrice: {
    fontSize: 16,
    fontFamily: 'Sora-Bold',
    color: Colors.primary,
  },
  ticketQuantity: {
    fontSize: 14,
    fontFamily: 'Sora-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  editTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 16,
  },
  editTicketButtonText: {
    fontSize: 15,
    fontFamily: 'Sora-SemiBold',
    color: Colors.primary,
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
  label: {
    color: '#111827',
    fontSize: 18,
    fontFamily: 'Sora-Regular',
    color: Colors.primary,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Sora-Regular',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  verticalOptions: {
    gap: 10,
  },
  typeOption: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  typeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  selectedTypeOption: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  labelText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Sora-Regular',
  },
  selectedTypeOptionText: {
    color: Colors.primary,
  },
  typeOptionDescription: {
    fontSize: 14,
    marginTop: 6,
    color: Colors.gray600,
    fontFamily: 'Sora-Regular',
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
  modalButtonDisabled: {
    opacity: 0.6,
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

export default EventTicketSection;
