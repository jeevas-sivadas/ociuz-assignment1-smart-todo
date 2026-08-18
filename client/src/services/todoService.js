import api from "./api";

// =========================
// Get Todos
// =========================

export const getTodos = async (params = {}, token) => {
  try {
    const response = await api.get("/api/todos", {
      params: params || {},
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error(
      "GET TODOS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// Create Todo
// =========================

export const createTodo = async (todoData, token) => {
  try {
    const response = await api.post(
      "/api/todos",
      todoData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "CREATE TODO ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// Update Todo
// =========================

export const updateTodo = async (
  todoId,
  todoData,
  token
) => {
  try {
    const response = await api.put(
      `/api/todos/${todoId}`,
      todoData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "UPDATE TODO ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// Toggle Todo
// =========================

export const toggleTodo = async (
  todoId,
  token
) => {
  try {
    const response = await api.patch(
      `/api/todos/${todoId}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "TOGGLE TODO ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// Delete Todo
// =========================

export const deleteTodo = async (
  todoId,
  token
) => {
  try {
    const response = await api.delete(
      `/api/todos/${todoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "DELETE TODO ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};