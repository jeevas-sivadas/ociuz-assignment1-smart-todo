import api from "./api";

const headers = (token) => ({
  Authorization: `Bearer ${token}`
});

const handleError = (error) => {
  console.error(
    error.response?.data || error.message
  );

  throw error;
};

export const getTodos = async (params = {}, token) => {
  try {
    const response = await api.get("/api/todos", {
      params,
      headers: headers(token)
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createTodo = async (todoData, token) => {
  try {
    const response = await api.post(
      "/api/todos",
      todoData,
      { headers: headers(token) }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateTodo = async (todoId, todoData, token) => {
  try {
    const response = await api.put(
      `/api/todos/${todoId}`,
      todoData,
      { headers: headers(token) }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const toggleTodo = async (todoId, token) => {
  try {
    const response = await api.patch(
      `/api/todos/${todoId}/toggle`,
      {},
      { headers: headers(token) }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTodo = async (todoId, token) => {
  try {
    const response = await api.delete(
      `/api/todos/${todoId}`,
      { headers: headers(token) }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};