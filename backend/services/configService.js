import { getConfig, addItem, removeItem } from "../src/configStore.js";

export function readConfig() {
  return getConfig();
}

export function addToList(list, value) {
  return addItem(list, value);
}

export function removeFromList(list, value) {
  return removeItem(list, value);
}
