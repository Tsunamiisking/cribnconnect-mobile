import api from "../api"

export const getEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const createEvent = async (data) => {
  const res = await api.post("/events", data);
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};
