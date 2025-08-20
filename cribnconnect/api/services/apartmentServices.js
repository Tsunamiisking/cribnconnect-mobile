import api from "../api";

export const getApartments = async () => {
  const res = await api.get("/apartments");
  return res.data;
};

export const createApartment = async (data) => {
  const res = await api.post("/apartments", data);
  return res.data;
};

export const getApartmentById = async (id) => {
  const res = await api.get(`/apartments/${id}`);
  return res.data;
};
