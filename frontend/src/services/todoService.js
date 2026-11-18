import api from "./api";

export const getTodos = async () => {
  const { data } = await api.get("/todos");
  return data;
};

export const getTodo = async (id) => {
  const { data } = await api.get(`/todos/${id}`);
  return data;
};

export const createTodo = async (todo) => {
  const { data } = await api.post("/todos", todo);
  return data;
};

export const updateTodo = async (id, todo) => {
  const { data } = await api.put(`/todos/${id}`, todo);
  return data;
};

export const deleteTodo = async (id) => {
  const { data } = await api.delete(`/todos/${id}`);
  return data;
};