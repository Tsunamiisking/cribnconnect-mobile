import api from "../api";

// Initialize ticket purchase - Supports both old and new formats
export const purchaseTickets = async (eventId, ticketsOrType, quantity = null) => {
  // New format: ticketsOrType is an array of { ticketType, quantity }
  // Old format: ticketsOrType is a string (ticketType), quantity is a number
  
  const requestBody = {
    eventId,
  };
  
  if (Array.isArray(ticketsOrType)) {
    // New format: Multiple tickets
    requestBody.tickets = ticketsOrType;
  } else {
    // Old format: Single ticket (backward compatibility)
    requestBody.ticketType = ticketsOrType;
    requestBody.quantity = quantity;
  }
  
  const res = await api.post("/payments/tickets/purchase", requestBody);
  return res.data;
};

// Verify payment and get tickets
export const verifyPayment = async (reference) => {
  const res = await api.get(`/payments/tickets/verify/${reference}`);
  return res.data;
};

// Get user's tickets
export const getMyTickets = async (params = {}) => {
  const { status, page = 1, limit = 20 } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status) queryParams.append('status', status);
  
  const res = await api.get(`/payments/tickets/my-tickets?${queryParams.toString()}`);
  return res.data;
};

// Get tickets grouped by event (for main tickets screen)
export const getTicketsByEvent = async () => {
  const res = await api.get('/payments/tickets/by-event');
  return res.data;
};

// Get all tickets for a specific event (for event tickets detail screen)
export const getEventTickets = async (eventId) => {
  const res = await api.get(`/payments/tickets/event/${eventId}`);
  return res.data;
};

// Get single ticket details
export const getTicketById = async (ticketId) => {
  const res = await api.get(`/payments/tickets/${ticketId}`);
  return res.data;
};

// Cancel reservation
export const cancelReservation = async (reservationId) => {
  const res = await api.put(`/payments/tickets/${reservationId}/cancel`);
  return res.data;
};
