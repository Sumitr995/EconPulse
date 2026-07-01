import { addToList, removeFromList } from "../services/configService.js";

export function addCompetitor(req, res, next) {
  try {
    res.json(addToList("competitors", req.body.value));
  } catch (err) {
    next(err);
  }
}

export function removeCompetitor(req, res, next) {
  try {
    res.json(removeFromList("competitors", req.params.value));
  } catch (err) {
    next(err);
  }
}
