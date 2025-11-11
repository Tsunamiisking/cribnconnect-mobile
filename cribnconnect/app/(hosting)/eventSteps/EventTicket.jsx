import { Colors } from "@/constants/Colors";
import useHostingStore from "@/stores/hostingStore";
import { Plus, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EventTicket({ styles }) {
  const { eventData, updateEventData } = useHostingStore();
  const [isFree, setIsFree] = useState(eventData.isFree || false);
  const [ticketTypes, setTicketTypes] = useState(eventData.ticketTypes || []);
  const [showCustomTicket, setShowCustomTicket] = useState(false);
  const [customTicketName, setCustomTicketName] = useState("");
  const [customTicketPrice, setCustomTicketPrice] = useState("");
  const [customTicketQuantity, setCustomTicketQuantity] = useState("");

  // Predefined ticket types
  const predefinedTypes = [
    { id: 'regular', name: 'Regular', price: '', quantity: '' },
    { id: 'vip', name: 'VIP', price: '', quantity: '' },
    { id: 'vvip', name: 'VVIP', price: '', quantity: '' }
  ];

  // Update store when ticket data changes
  useEffect(() => {
    updateEventData('isFree', isFree);
    updateEventData('ticketTypes', ticketTypes);
    
    // Calculate average/minimum price for backend compatibility
    if (!isFree && ticketTypes.length > 0) {
      const prices = ticketTypes.map(t => parseFloat(t.price) || 0).filter(p => p > 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      updateEventData('ticketPrice', minPrice.toString());
    } else {
      updateEventData('ticketPrice', "0");
    }
  }, [isFree, ticketTypes]);

  // Initialize from store data
  useEffect(() => {
    setIsFree(eventData.isFree || false);
    setTicketTypes(eventData.ticketTypes || []);
  }, []);

  const formatNaira = (amount) => {
    if (!amount || isNaN(amount)) return "";
    const num = parseFloat(amount.replace(/,/g, ""));
    return `₦${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePriceChange = (value) => {
    // Only allow numbers and decimal points
    return value.replace(/[^0-9.]/g, '');
  };

  const handleQuantityChange = (value) => {
    // Only allow whole numbers
    return value.replace(/[^0-9]/g, '');
  };

  const toggleFree = () => {
    const newIsFree = !isFree;
    setIsFree(newIsFree);
    if (newIsFree) {
      setTicketTypes([]);
    }
  };

  const addPredefinedTicket = (typeId) => {
    const type = predefinedTypes.find(t => t.id === typeId);
    if (type && !ticketTypes.find(t => t.id === typeId)) {
      setTicketTypes(prev => [...prev, { 
        ...type, 
        price: '', 
        quantity: '',
        isActive: true // Default to active when created
      }]);
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
      isActive: true // Default to active when created
    };
    
    setTicketTypes(prev => [...prev, newTicket]);
    setCustomTicketName("");
    setCustomTicketPrice("");
    setCustomTicketQuantity("");
    setShowCustomTicket(false);
  };

  const removeTicket = (ticketId) => {
    setTicketTypes(prev => prev.filter(t => t.id !== ticketId));
  };

  const updateTicketPrice = (ticketId, price) => {
    setTicketTypes(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, price: handlePriceChange(price) }
        : ticket
    ));
  };

  const updateTicketQuantity = (ticketId, quantity) => {
    setTicketTypes(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, quantity: handleQuantityChange(quantity) }
        : ticket
    ));
  };

  const getAvailablePredefinedTypes = () => {
    return predefinedTypes.filter(type => 
      !ticketTypes.find(ticket => ticket.id === type.id)
    );
  };

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How can people access your event?</Text>
      <Text style={styles.sectionSubtitle}>Set ticket pricing for your event</Text>

      <View style={{ marginTop: 24 }}>
        {/* Free Event Toggle */}
        <TouchableOpacity
          onPress={toggleFree}
          style={[
            styles.typeOption,
            isFree && styles.selectedTypeOption,
          ]}
        >
          <Text style={[
            styles.labelText,
            isFree && styles.selectedTypeOptionText
          ]}>
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
              <View key={ticket.id} style={[styles.typeOption, { marginTop: 12 }]}>
                <View style={styles.typeOptionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.labelText}>{ticket.name}</Text>
                    
                    {/* Price Input */}
                    <View style={{ marginTop: 8 }}>
                      <Text style={[styles.typeOptionDescription, { marginBottom: 4 }]}>
                        Price (₦)
                      </Text>
                      <TextInput
                        style={[styles.input, { height: 45 }]}
                        placeholder="Enter price"
                        keyboardType="numeric"
                        value={ticket.price}
                        onChangeText={(value) => updateTicketPrice(ticket.id, value)}
                      />
                    </View>

                    {/* Quantity Input */}
                    <View style={{ marginTop: 8 }}>
                      <Text style={[styles.typeOptionDescription, { marginBottom: 4 }]}>
                        Available Tickets
                      </Text>
                      <TextInput
                        style={[styles.input, { height: 45 }]}
                        placeholder="Enter quantity"
                        keyboardType="numeric"
                        value={ticket.quantity}
                        onChangeText={(value) => updateTicketQuantity(ticket.id, value)}
                      />
                    </View>

                    {/* Display Summary */}
                    <Text style={[styles.typeOptionDescription, { marginTop: 8 }]}>
                      {ticket.price && ticket.quantity 
                        ? `${formatNaira(ticket.price)} • ${ticket.quantity} tickets available`
                        : "Complete price and quantity"
                      }
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeTicket(ticket.id)}
                    style={{
                      padding: 8,
                      backgroundColor: Colors.warning,
                      borderRadius: 6,
                      marginLeft: 12,
                      alignSelf: 'flex-start'
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
                {/* <Text style={styles.label}>Quick Add Ticket Types</Text> */}
                <View style={styles.verticalOptions}>
                  {getAvailablePredefinedTypes().map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      onPress={() => addPredefinedTicket(type.id)}
                      style={styles.typeOption}
                    >
                      <View style={styles.typeOptionRow}>
                        <Plus size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Add {type.name} Ticket</Text>
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
                    <Text style={styles.labelText}>Add Custom Ticket Type</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[styles.typeOption, styles.selectedTypeOption]}>
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
                    <Text style={[styles.typeOptionDescription, { marginBottom: 4 }]}>
                      Price (₦)
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter price"
                      keyboardType="numeric"
                      value={customTicketPrice}
                      onChangeText={(value) => setCustomTicketPrice(handlePriceChange(value))}
                    />
                  </View>

                  {/* Quantity */}
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.typeOptionDescription, { marginBottom: 4 }]}>
                      Available Tickets
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter quantity"
                      keyboardType="numeric"
                      value={customTicketQuantity}
                      onChangeText={(value) => setCustomTicketQuantity(handleQuantityChange(value))}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                    <TouchableOpacity
                      onPress={addCustomTicket}
                      style={{
                        flex: 1,
                        backgroundColor: Colors.primary,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>Add Ticket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowCustomTicket(false);
                        setCustomTicketName("");
                        setCustomTicketPrice("");
                        setCustomTicketQuantity("");
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: Colors.gray600,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Sora-SemiBold' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Ticket Summary */}
            {ticketTypes.length > 0 && (
              <View style={[styles.typeOption, { marginTop: 16, backgroundColor: Colors.blue50 }]}>
                <Text style={[styles.labelText, { color: Colors.primary, marginBottom: 8 }]}>
                  Ticket Summary ({ticketTypes.length} types)
                </Text>
                {ticketTypes.map((ticket) => {
                  const hasPrice = ticket.price && parseFloat(ticket.price) > 0;
                  const hasQuantity = ticket.quantity && parseInt(ticket.quantity) > 0;
                  const isComplete = hasPrice && hasQuantity;
                  
                  return (
                    <Text key={ticket.id} style={styles.typeOptionDescription}>
                      • {ticket.name}: {
                        isComplete 
                          ? `${formatNaira(ticket.price)} • ${ticket.quantity} tickets`
                          : "⚠️ Incomplete (add price & quantity)"
                      }
                    </Text>
                  );
                })}
                
                {/* Total Tickets Available */}
                {ticketTypes.some(t => t.quantity) && (
                  <Text style={[styles.typeOptionDescription, { marginTop: 8, fontFamily: 'Sora-SemiBold' }]}>
                    Total Tickets: {ticketTypes.reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0)}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Display Current Selection */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.typeOptionDescription}>
            Event Type: {isFree ? "Free Event" : `Paid Event - ${ticketTypes.length} ticket type(s)`}
          </Text>
        </View>
      </View>
    </View>
  );
}
