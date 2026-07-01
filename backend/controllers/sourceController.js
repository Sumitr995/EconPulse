import { addToList, removeFromList } from "../services/configService.js";

export function addSource(req, res, next) {
  try {
    res.json(addToList("sources", req.body.value));
  } catch (err) {
    next(err);
  }
}

export function removeSource(req, res, next) {
  try {
    res.json(removeFromList("sources", req.params.value));
  } catch (err) {
    next(err);
  }
}
