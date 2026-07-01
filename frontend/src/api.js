import axios from "axios";

const client = axios.create({ baseURL: "https://econ-pulse-backend.vercel.app" });

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

export async function runNews() {
  const { data } = await client.get("/news/run");
  return data;
}
