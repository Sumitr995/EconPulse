export function validateBody(fields) {
  return (req, _res, next) => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        const err = new Error(`Missing required field: ${field}`);
        err.status = 400;
        return next(err);
      }
    }
    next();
  };
}
