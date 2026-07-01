import { readConfig } from "../services/configService.js";

export function getConfig(_req, res, next) {
  try {
    res.json(readConfig());
  } catch (err) {
    next(err);
  }
}
