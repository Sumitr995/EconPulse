import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "config.json");

export function getConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function saveConfig(config) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function addItem(list, value) {
  const config = getConfig();
  if (!config[list].includes(value)) {
    config[list].push(value);
    saveConfig(config);
  }
  return config;
}

export function removeItem(list, value) {
  const config = getConfig();
  config[list] = config[list].filter((v) => v !== value);
  saveConfig(config);
  return config;
}
