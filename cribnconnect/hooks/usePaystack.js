import { useState } from "react";
import { Alert } from "react-native";
import { initializePayment } from "../api/services/paymentServices";

export const usePaystack = () => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const initPayment = async ({ amount, email, metadata }) => {
    try {
      setLoading(true);

      console.log("Initializing payment:", { amount, email, metadata });

      // Call backend to initialize payment
      const response = await initializePayment({
        amount,
        email,
        metadata, // Include hostId, eventId, apartmentId, etc.
      });

      console.log("Payment initialized successfully:", response);
      setPaymentData(response);
      return response;
    } catch (error) {
      console.error("Payment initialization error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to initialize payment"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    initPayment,
    loading,
    paymentData,
  };
};
