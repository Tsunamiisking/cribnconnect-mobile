import { getEventById } from "@/api/services/eventServices";
import { purchaseTickets } from "@/api/services/ticketServices";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { Clock, Minus, Plus, Ticket as TicketIcon } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TicketPurchaseScreen = () => {
  const { id } = useLocalSearchParams(); // Event ID
  const { publicProfile, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({}); // { ticketName: quantity }
  const [purchasing, setPurchasing] = useState(false);
  const hasInitiatedPaymentRef = useRef(false);
  
  const MAX_TOTAL_TICKETS = 5;

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await getEventById(id);
      setEvent(eventData);
    } catch (error) {
      console.error("Error fetching event:", error);
      Alert.alert("Error", "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTickets = (ticket) => {
    return ticket.quantity - ticket.sold;
  };

  const getTotalSelectedTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handleQuantityChange = (ticketName, change) => {
    const currentQty = selectedTickets[ticketName] || 0;
    const newQty = currentQty + change;
    const totalSelected = getTotalSelectedTickets();
    const remainingSlots = MAX_TOTAL_TICKETS - totalSelected;

    // Don't allow if it would exceed max total
    if (change > 0 && remainingSlots <= 0) {
      Alert.alert(
        "Maximum Reached",
        `You can only select up to ${MAX_TOTAL_TICKETS} tickets in total.`
      );
      return;
    }

    // Update quantity
    if (newQty <= 0) {
      // Remove ticket type if quantity is 0
      const updated = { ...selectedTickets };
      delete updated[ticketName];
      setSelectedTickets(updated);
    } else {
      setSelectedTickets({
        ...selectedTickets,
        [ticketName]: newQty,
      });
    }
  };

  const calculateTotal = () => {
    if (!event?.ticketTypes) return 0;
    
    return Object.entries(selectedTickets).reduce((total, [ticketName, qty]) => {
      const ticket = event.ticketTypes.find(t => t.name === ticketName);
      return total + (ticket ? ticket.price * qty : 0);
    }, 0);
  };

  const calculatePlatformFee = () => {
    if (!event?.ticketTypes) return 0;
    
    return Object.entries(selectedTickets).reduce((total, [ticketName, qty]) => {
      const ticket = event.ticketTypes.find(t => t.name === ticketName);
      if (!ticket) return total;
      const feePerTicket = ticket.price * 0.06 + 100; // 6% + ₦100
      return total + (feePerTicket * qty);
    }, 0);
  };

  const handlePurchase = async () => {
    // Prevent double-click
    if (hasInitiatedPaymentRef.current) {
      console.log("🚫 Payment already initiated, ignoring click");
      return;
    }

    // Validate at least one ticket is selected
    const totalSelected = getTotalSelectedTickets();
    if (totalSelected === 0) {
      Alert.alert("No Tickets Selected", "Please select at least one ticket.");
      return;
    }

    try {
      setPurchasing(true);
      hasInitiatedPaymentRef.current = true;

      // Convert selectedTickets object to array format for backend
      const ticketsArray = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketType, quantity]) => ({
          ticketType,
          quantity
        }));

      console.log("🎫 Purchasing tickets:", ticketsArray);

      // Create reservation and get payment details
      const response = await purchaseTickets(event._id, ticketsArray);

      console.log("✅ Purchase response:", response);

      // Reset flag before navigation
      hasInitiatedPaymentRef.current = false;
      setPurchasing(false);

      // Navigate to WebView checkout with Paystack URL
      router.push({
        pathname: "/paystack-checkout/[id]",
        params: {
          id: response.reservation.id,
          url: response.payment.authorization_url,
          reference: response.payment.reference,
          eventId: event._id,
        },
      });
    } catch (error) {
      console.error("❌ Purchase error:", error);
      hasInitiatedPaymentRef.current = false;
      setPurchasing(false);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.message || error.message || "Failed to initiate payment. Please try again.";
      
      // Check if it's a ticket availability error (404 with specific message)
      if (error.response?.status === 404 && errorMessage.includes("not found or inactive")) {
        // Extract ticket type name from error message
        const ticketTypeMatch = errorMessage.match(/Ticket type ["'](.+?)["']/);
        const ticketType = ticketTypeMatch ? ticketTypeMatch[1] : "Selected ticket";
        
        Alert.alert(
          "Ticket Unavailable",
          `${ticketType} tickets are no longer available (sold out or expired). Please select a different ticket type.`,
          [{ text: "OK" }]
        );
      } else if (error.response?.status === 400) {
        // Handle validation errors (max tickets, insufficient tickets, etc.)
        Alert.alert("Purchase Failed", errorMessage, [{ text: "OK" }]);
      } else {
        // Generic error
        Alert.alert(
          "Purchase Failed",
          errorMessage,
          [{ text: "OK" }]
        );
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Get Tickets" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Get Tickets" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = calculateTotal();
  const platformFee = calculatePlatformFee();

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Get Tickets" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Header */}
        <View style={styles.eventHeader}>
          <Image
            source={{
              uri: event.media?.[0]?.url || event.media?.[0]?.thumbnail_url,
            }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              • {event.time}
            </Text>
            <Text style={styles.eventLocation}>
              📍 {event.location?.venue || event.location?.city}
            </Text>
          </View>
        </View>

        {/* Ticket Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Tickets</Text>
            <Text style={styles.ticketCounter}>
              {getTotalSelectedTickets()} / {MAX_TOTAL_TICKETS} selected
            </Text>
          </View>

          {event.ticketTypes?.map((ticket, index) => {
            const available = getAvailableTickets(ticket);
            const isSoldOut = available === 0;
            const isInactive = !ticket.isActive; // Check if ticket type is inactive/expired
            const isDisabled = isSoldOut || isInactive;
            const currentQty = selectedTickets[ticket.name] || 0;
            const isSelected = currentQty > 0;
            const totalSelected = getTotalSelectedTickets();
            const canIncrease = totalSelected < MAX_TOTAL_TICKETS && currentQty < available && !isInactive;

            return (
              <View
                key={index}
                style={[
                  styles.ticketCard,
                  isSelected && styles.ticketCardSelected,
                  isDisabled && styles.ticketCardDisabled,
                ]}
              >
                <View style={styles.ticketCardLeft}>
                  <View style={styles.ticketIconContainer}>
                    <TicketIcon
                      size={24}
                      color={isSelected ? Colors.primary : Colors.gray500}
                    />
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text
                      style={[
                        styles.ticketName,
                        isDisabled && styles.ticketNameDisabled,
                      ]}
                    >
                      {ticket.name}
                    </Text>
                    <Text style={styles.ticketPrice}>
                      ₦{ticket.price.toLocaleString()}
                    </Text>
                    <Text style={styles.ticketAvailable}>
                      {isInactive 
                        ? "Expired" 
                        : isSoldOut 
                        ? "Sold Out" 
                        : `${available} available`}
                    </Text>
                  </View>
                </View>

                {!isDisabled && (
                  <View style={styles.ticketQuantityControls}>
                    <TouchableOpacity
                      style={[
                        styles.ticketQuantityButton,
                        currentQty === 0 && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => handleQuantityChange(ticket.name, -1)}
                      disabled={currentQty === 0}
                    >
                      <Minus
                        size={16}
                        color={currentQty === 0 ? Colors.gray400 : Colors.white}
                      />
                    </TouchableOpacity>

                    <Text style={styles.ticketQuantityText}>{currentQty}</Text>

                    <TouchableOpacity
                      style={[
                        styles.ticketQuantityButton,
                        !canIncrease && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => handleQuantityChange(ticket.name, 1)}
                      disabled={!canIncrease}
                    >
                      <Plus
                        size={16}
                        color={!canIncrease ? Colors.gray400 : Colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          <Text style={styles.quantityNote}>
            Maximum {MAX_TOTAL_TICKETS} tickets total per purchase
          </Text>
        </View>

        {/* Price Breakdown */}
        {getTotalSelectedTickets() > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceBreakdown}>
              {Object.entries(selectedTickets).map(([ticketName, qty]) => {
                const ticket = event.ticketTypes.find(t => t.name === ticketName);
                if (!ticket) return null;
                
                return (
                  <View key={ticketName} style={styles.priceRow}>
                    <Text style={styles.priceLabel}>
                      {ticketName} × {qty}
                    </Text>
                    <Text style={styles.priceValue}>
                      ₦{(ticket.price * qty).toLocaleString()}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Charge</Text>
                <Text style={styles.priceValue}>
                  ₦{platformFee.toLocaleString()}
                </Text>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ₦{(total + platformFee).toLocaleString()}
                </Text>
              </View>

              <View style={styles.feeNote}>
                <Text style={styles.feeNoteText}>
                  Service charge covers payment processing and platform fees
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Important Notes */}
        <View style={styles.section}>
          <View style={styles.noteCard}>
            <Clock size={20} color={Colors.primary} />
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>
                Reservation holds for 10 minutes
              </Text>
              <Text style={styles.noteText}>
                Complete your payment within 10 minutes or your reservation will
                expire
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={{ height: 20 }} /> */}
      </ScrollView>

      {/* Bottom Bar */}
      {getTotalSelectedTickets() > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <View>
              <Text style={styles.bottomBarLabel}>
                {getTotalSelectedTickets()} Ticket{getTotalSelectedTickets() > 1 ? 's' : ''}
              </Text>
              <Text style={styles.bottomBarPrice}>
                ₦{(total + platformFee).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                purchasing && styles.purchaseButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  Continue to Payment
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Sora-Regular",
    fontSize: 16,
    color: Colors.gray500,
  },
  eventHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  eventInfo: {
    gap: 8,
  },
  eventTitle: {
    fontFamily: "Sora-Bold",
    fontSize: 20,
    color: Colors.gray900,
  },
  eventDate: {
    fontFamily: "Sora-Medium",
    fontSize: 14,
    color: Colors.gray600,
  },
  eventLocation: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray600,
  },
  section: {
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.gray100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Sora-Bold",
    fontSize: 18,
    color: Colors.gray900,
  },
  ticketCounter: {
    fontFamily: "Sora-SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
  ticketCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  ticketCardSelected: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.primary,
  },
  ticketCardDisabled: {
    opacity: 0.5,
  },
  ticketCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  ticketIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 4,
  },
  ticketNameDisabled: {
    color: Colors.gray500,
  },
  ticketPrice: {
    fontFamily: "Sora-Bold",
    fontSize: 15,
    color: Colors.gray900,
    marginBottom: 4,
  },
  ticketAvailable: {
    fontFamily: "Sora-Regular",
    fontSize: 12,
    color: Colors.gray600,
  },
  ticketQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ticketQuantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketQuantityText: {
    fontFamily: "Sora-Bold",
    fontSize: 18,
    color: Colors.gray900,
    minWidth: 24,
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  quantityDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  quantityText: {
    fontFamily: "Sora-Bold",
    fontSize: 32,
    color: Colors.gray900,
  },
  quantityLabel: {
    fontFamily: "Sora-Regular",
    fontSize: 14,
    color: Colors.gray600,
    marginTop: 4,
  },
  quantityNote: {
    fontFamily: "Sora-Regular",
    fontSize: 13,
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 12,
  },
  priceBreakdown: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontFamily: "Sora-Regular",
    fontSize: 15,
    color: Colors.gray700,
  },
  priceValue: {
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
    color: Colors.gray900,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Sora-Bold",
    fontSize: 18,
    color: Colors.gray900,
  },
  totalValue: {
    fontFamily: "Sora-Bold",
    fontSize: 22,
    color: Colors.primary,
  },
  feeNote: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.blue50,
    borderRadius: 8,
  },
  feeNoteText: {
    fontFamily: "Sora-Regular",
    fontSize: 12,
    color: Colors.gray700,
    textAlign: "center",
  },
  noteCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.orange50,
    borderRadius: 12,
    gap: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
    color: Colors.gray900,
    marginBottom: 4,
  },
  noteText: {
    fontFamily: "Sora-Regular",
    fontSize: 13,
    color: Colors.gray700,
    lineHeight: 18,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bottomBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBarLabel: {
    fontFamily: "Sora-Regular",
    fontSize: 13,
    color: Colors.gray600,
    marginBottom: 4,
  },
  bottomBarPrice: {
    fontFamily: "Sora-Bold",
    fontSize: 22,
    color: Colors.gray900,
  },
  purchaseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: "center",
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontFamily: "Sora-SemiBold",
    fontSize: 15,
    color: Colors.white,
  },
});

export default TicketPurchaseScreen;
