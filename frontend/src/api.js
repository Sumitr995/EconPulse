import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://econ-pulse-backend.vercel.app";
const client = axios.create({ baseURL: BASE_URL });

export async function getConfig() {
  const { data } = await client.get("/config");
  return data;
}

export async function addItem(list, value) {
  const { data } = await client.post(`/${list}`, { value });
  return data;
}

export async function removeItem(list, value) {
  const { data } = await client.delete(`/${list}/${encodeURIComponent(value)}`);
  return data;
}

export async function runNews(query = "") {
  const params = query ? { q: query } : {};
  const { data } = await client.get("/news/run", { params });
  return data;
}
