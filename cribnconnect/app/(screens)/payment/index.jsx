import BackHeader from "@/components/BackHeader";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { usePaystack } from "@/hooks/usePaystack";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentScreen = () => {
  const { publicProfile } = useAuth();
  const { initPayment, loading } = usePaystack();
  const [paymentRef, setPaymentRef] = useState(null);
  const [showPaystack, setShowPaystack] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Get payment details from navigation params (you'll pass these when navigating)
  useEffect(() => {
    // In a real app, you'd get these from route params or global state
    // For now, this is a template - you'll customize based on your booking flow
    handleInitPayment();
  }, []);

  const handleInitPayment = async () => {
    try {
      // Example payment initialization
      // You'll replace these with actual values from your booking flow
      const response = await initPayment({
        amount: 5000, // ₦5,000 in kobo
        email: publicProfile.email,
        metadata: {
          userId: publicProfile._id,
          hostId: "HOST_ID_HERE",
          eventId: "EVENT_ID_HERE",
          bookingType: "event", // or "apartment"
          // Include host's sub-account to credit their wallet
          subaccount: "HOST_SUBACCOUNT_CODE_HERE",
        },
      });

      setPaymentRef(response.reference);
      setShowPaystack(true);
    } catch (error) {
      Alert.alert("Error", "Failed to initialize payment");
      router.back();
    }
  };

  const handlePaymentSuccess = (response) => {
    console.log("Payment successful:", response);
    
    Alert.alert(
      "Success",
      "Payment completed successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            // Navigate to success screen or booking confirmation
            // router.push({
            //   pathname: "/booking-confirmation",
            //   params: {
            //     reference: response.transactionRef,
            //     amount: paymentDetails?.amount,
            //   }
            // });
            router.back();
          },
        },
      ]
    );
  };

  const handlePaymentCancel = () => {
    Alert.alert(
      "Payment Cancelled",
      "Your payment was cancelled. Would you like to try again?",
      [
        {
          text: "Retry",
          onPress: () => setShowPaystack(true),
        },
        {
          text: "Go Back",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackHeader title="Payment" showUser={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Payment" showUser={false} />
      
      <View style={styles.content}>
        {showPaystack && paymentRef ? (
          <Paystack
            paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY}
            amount={5000} // Amount in kobo (₦50.00)
            billingEmail={publicProfile.email}
            billingName={`${publicProfile.firstName} ${publicProfile.lastName}`}
            billingMobile={publicProfile.phone}
            reference={paymentRef}
            onCancel={handlePaymentCancel}
            onSuccess={handlePaymentSuccess}
            autoStart={true}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Payment screen ready. Configure with booking details.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Sora-Regular",
    color: Colors.gray600,
    textAlign: "center",
  },
});

export default PaymentScreen;
