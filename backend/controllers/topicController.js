import { addToList, removeFromList } from "../services/configService.js";

export function addTopic(req, res, next) {
  try {
    res.json(addToList("topics", req.body.value));
  } catch (err) {
    next(err);
  }
}

export function removeTopic(req, res, next) {
  try {
    res.json(removeFromList("topics", req.params.value));
  } catch (err) {
    next(err);
  }
}
