import api from "../api";

// Initialize payment
export const initializePayment = async (paymentData) => {
  const res = await api.post("/payments/initialize", paymentData);
  return res.data;
};

// Verify payment (optional - webhook handles this)
export const verifyPayment = async (reference) => {
  const res = await api.get(`/payments/verify/${reference}`);
  return res.data;
};

// Get user's payment history
export const getPaymentHistory = async (userId) => {
  const res = await api.get(`/payments/history/${userId}`);
  return res.data;
};
