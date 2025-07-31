import axios from "axios";
export const auth = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});
export const products = axios.create({
  baseURL: "http://localhost:5000/api/products",
});
export const category = axios.create({
  baseURL: "http://localhost:5000/api/categories",
});