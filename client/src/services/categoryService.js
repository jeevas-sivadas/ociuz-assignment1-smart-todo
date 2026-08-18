import api from "./api";

// =========================
// Get All Categories
// =========================

export const getCategories = async (token) => {
  const response = await api.get(
    "/api/categories",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// =========================
// Create Category
// =========================

export const createCategory = async (
  categoryData,
  token
) => {
  const response = await api.post(
    "/api/categories",
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// =========================
// Update Category
// =========================

export const updateCategory = async (
  categoryId,
  categoryData,
  token
) => {
  const response = await api.put(
    `/api/categories/${categoryId}`,
    categoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


// =========================
// Delete Category
// =========================

export const deleteCategory = async (
  categoryId,
  token
) => {
  const response = await api.delete(
    `/api/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};