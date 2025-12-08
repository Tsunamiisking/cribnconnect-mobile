import api from "../api";

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
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

// Bank verification
export const getNigerianBanks = async () => {
  const res = await api.get("/users/banks");
  return res.data;
};

export const verifyBankAccount = async (accountNumber, bankCode) => {
  const res = await api.post("/users/verify-bank-account", {
    accountNumber,
    bankCode,
  });
  return res.data;
};

// Wallet management
export const createPaystackSubAccount = async (userId, accountNumber, bankCode) => {
  const res = await api.post(`/users/${userId}/paystack-subaccount`, {
    accountNumber,
    bankCode,
  });
  return res.data;
};

export const getWalletBalance = async (userId) => {
  const res = await api.get(`/users/${userId}/wallet/balance`);
  return res.data;
};

export const withdrawFromWallet = async (userId, data) => {
  const res = await api.post(`/users/${userId}/withdraw`, data);
  return res.data;
};

