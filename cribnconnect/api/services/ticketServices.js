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

// ===== QR SCANNING ENDPOINTS =====

// Scan ticket (in-app)
export const scanTicket = async (ticketCode, scanData = {}) => {
  const res = await api.post(`/tickets/scan/${ticketCode}`, {
    scanMethod: scanData.scanMethod || 'in-app',
    scanLocation: scanData.scanLocation || null,
  });
  return res.data;
};

// Get scan statistics for an event
export const getScanStats = async (eventId) => {
  const res = await api.get(`/tickets/events/${eventId}/scan-stats`);
  return res.data;
};

// ===== STAFF MANAGEMENT ENDPOINTS =====

// Get authorized staff for an event
export const getEventStaff = async (eventId) => {
  const res = await api.get(`/tickets/events/${eventId}/staff`);
  return res.data;
};

// Add staff member
export const addEventStaff = async (eventId, userId, role) => {
  const res = await api.post(`/tickets/events/${eventId}/staff`, {
    userId,
    role, // 'validator' or 'manager'
  });
  return res.data;
};

// Remove staff member
export const removeEventStaff = async (eventId, staffUserId) => {
  const res = await api.delete(`/tickets/events/${eventId}/staff/${staffUserId}`);
  return res.data;
};

// Revoke all staff access (Host only)
export const revokeAllStaff = async (eventId) => {
  const res = await api.delete(`/tickets/events/${eventId}/staff`);
  return res.data;
};
