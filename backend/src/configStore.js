import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "config.json");

const isVercel = process.env.VERCEL === "1";

let memoryConfig = null;

function loadConfig() {
  if (isVercel) {
    if (!memoryConfig) {
      memoryConfig = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    }
    return memoryConfig;
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

function persistConfig(config) {
  if (isVercel) {
    memoryConfig = config;
    return;
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function getConfig() {
  return loadConfig();
}

export function addItem(list, value) {
  const config = loadConfig();
  if (!config[list].includes(value)) {
    config[list].push(value);
    persistConfig(config);
  }
  return config;
}

export function removeItem(list, value) {
  const config = loadConfig();
  config[list] = config[list].filter((v) => v !== value);
  persistConfig(config);
  return config;
}
