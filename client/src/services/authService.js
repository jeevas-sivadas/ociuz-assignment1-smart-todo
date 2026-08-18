import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await api.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await api.post(
    "/api/auth/login",
    userData
  );

  return response.data;
};

// Get protected user
export const getProtectedUser = async (token) => {
  const response = await api.get(
    "/api/auth/protected",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};