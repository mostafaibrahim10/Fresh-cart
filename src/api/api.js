import axios from "axios";

export const BASE_URL =
  "https://ecommerce.routemisr.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.token = token;
  }

  return config;
});


export const GetUserOrders = () => {
  return api.get("/orders/user/");
};

export default api;