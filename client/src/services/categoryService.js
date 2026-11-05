import api from "./api";

const headers = (token) => ({
  Authorization: `Bearer ${token}`
});

export const getCategories = async (token) => {
  const response = await api.get("/api/categories", {
    headers: headers(token)
  });

  return response.data;
};

export const createCategory = async (categoryData, token) => {
  const response = await api.post(
    "/api/categories",
    categoryData,
    { headers: headers(token) }
  );

  return response.data;
};

export const updateCategory = async (categoryId, categoryData, token) => {
  const response = await api.put(
    `/api/categories/${categoryId}`,
    categoryData,
    { headers: headers(token) }
  );

  return response.data;
};

export const deleteCategory = async (categoryId, token) => {
  const response = await api.delete(
    `/api/categories/${categoryId}`,
    { headers: headers(token) }
  );

  return response.data;
};