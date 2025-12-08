import api from "../api";

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const editUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const createPaystackSubAccount = async (userId) => {
  const res = await api.post(`/users/${userId}/paystack-subaccount`);
  return res.data;
};

export const withdrawFromWallet = async (userId, data) => {
  const res = await api.post(`/users/${userId}/withdraw`, data);
  return res.data;
};

