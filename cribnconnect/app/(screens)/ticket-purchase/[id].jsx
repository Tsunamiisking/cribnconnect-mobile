import { getEventById } from "@/api/services/eventServices";
import { purchaseTickets, verifyPayment } from "@/api/services/ticketServices";
import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { usePaystack } from "react-native-paystack-webview";
import { router, useLocalSearchParams } from "expo-router";
import { Clock, Minus, Plus, Ticket as TicketIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const { popup } = usePaystack();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const eventData = await getEventById(id);
      setEvent(eventData);

      // Auto-select first available ticket type
      if (eventData.ticketTypes?.length > 0) {
        const availableTicket = eventData.ticketTypes.find(
          (t) => t.isActive && t.quantity - t.sold > 0
        );
        if (availableTicket) {
          setSelectedTicket(availableTicket);
        }
      }
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

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const available = getAvailableTickets(selectedTicket);

    if (newQuantity >= 1 && newQuantity <= Math.min(10, available)) {
      setQuantity(newQuantity);
    }
  };

  const calculateTotal = () => {
    if (!selectedTicket) return 0;
    return selectedTicket.price * quantity;
  };

  const calculatePlatformFee = () => {
    if (!selectedTicket) return 0;
    const feePerTicket = selectedTicket.price * 0.06 + 100; // 6% + ₦100
    return feePerTicket * quantity;
  };

  const makePayment = (config) => {
    popup.newTransaction({
      reference: config.reference,
      amount: config.amount,
      email: user?.email,
      onSuccess: handlePaymentSuccess,
      onCancel: handlePaymentCancel,
      onError: (e) => {
        console.error("Payment error:", e);
        setPurchasing(false);
        setPaymentConfig(null);
      },
    });
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);

      const response = await purchaseTickets(
        event._id,
        selectedTicket.name,
        quantity
      );

      console.log("Purchase response:", response);

      const config = {
        reference: response.payment.reference,
        amount: response.payment.amount,
        email: publicProfile.email,
      };

      setPaymentConfig(config); // optional (for later verification)
      makePayment(config); // ✅ USE IT DIRECTLY
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchasing(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    console.log("Payment successful:", response);

    setPurchasing(false);

    try {
      await verifyPayment(response.reference); // ✅ ALWAYS USE THIS

      Alert.alert("Success 🎉", `Your ticket purchase was successful!`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setPaymentConfig(null);
    }
  };

  const handlePaymentCancel = (e) => {
    console.log("Payment cancelled:", e);
    setPurchasing(false);
    setPaymentConfig(null);

    Alert.alert(
      "Payment Cancelled",
      "You cancelled the payment. Your reservation will expire in 10 minutes.",
      [{ text: "OK" }]
    );
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
          <Text style={styles.sectionTitle}>Select Ticket Type</Text>

          {event.ticketTypes?.map((ticket, index) => {
            const available = getAvailableTickets(ticket);
            const isSoldOut = available === 0;
            const isSelected = selectedTicket?.name === ticket.name;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.ticketCard,
                  isSelected && styles.ticketCardSelected,
                  isSoldOut && styles.ticketCardDisabled,
                ]}
                onPress={() => !isSoldOut && setSelectedTicket(ticket)}
                disabled={isSoldOut}
              >
                <View style={styles.ticketCardLeft}>
                  <View style={styles.ticketIconContainer}>
                    <TicketIcon
                      size={24}
                      color={isSelected ? Colors.primary : Colors.gray500}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.ticketName,
                        isSoldOut && styles.ticketNameDisabled,
                      ]}
                    >
                      {ticket.name}
                    </Text>
                    <Text style={styles.ticketAvailable}>
                      {isSoldOut ? "Sold Out" : `${available} available`}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.ticketPrice,
                    isSoldOut && styles.ticketPriceDisabled,
                  ]}
                >
                  ₦{ticket.price.toLocaleString()}
                </Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <View style={styles.selectedDot} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quantity Selector */}
        {selectedTicket && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity === 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity === 1}
              >
                <Minus
                  size={20}
                  color={quantity === 1 ? Colors.gray400 : Colors.white}
                />
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Text style={styles.quantityLabel}>
                  Ticket{quantity > 1 ? "s" : ""}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity >=
                    Math.min(10, getAvailableTickets(selectedTicket)) &&
                    styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(1)}
                disabled={
                  quantity >= Math.min(10, getAvailableTickets(selectedTicket))
                }
              >
                <Plus
                  size={20}
                  color={
                    quantity >=
                    Math.min(10, getAvailableTickets(selectedTicket))
                      ? Colors.gray400
                      : Colors.white
                  }
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.quantityNote}>
              Maximum 10 tickets per purchase •{" "}
              {getAvailableTickets(selectedTicket)} available
            </Text>
          </View>
        )}

        {/* Price Breakdown */}
        {selectedTicket && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  {selectedTicket.name} × {quantity}
                </Text>
                <Text style={styles.priceValue}>₦{total.toLocaleString()}</Text>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
              </View>

              <View style={styles.feeNote}>
                <Text style={styles.feeNoteText}>
                  Platform fee (₦{platformFee.toLocaleString()}) is deducted
                  from host's payment
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

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      {selectedTicket && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <View>
              <Text style={styles.bottomBarLabel}>Total Amount</Text>
              <Text style={styles.bottomBarPrice}>
                ₦{total.toLocaleString()}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  sectionTitle: {
    fontFamily: "Sora-Bold",
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 16,
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
  ticketName: {
    fontFamily: "Sora-SemiBold",
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 4,
  },
  ticketNameDisabled: {
    color: Colors.gray500,
  },
  ticketAvailable: {
    fontFamily: "Sora-Regular",
    fontSize: 13,
    color: Colors.gray600,
  },
  ticketPrice: {
    fontFamily: "Sora-Bold",
    fontSize: 18,
    color: Colors.gray900,
  },
  ticketPriceDisabled: {
    color: Colors.gray500,
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
