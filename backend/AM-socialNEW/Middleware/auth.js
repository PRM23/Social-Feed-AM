const jwt_token = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.secretKey;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const error = new Error();
  error.status = 400;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt_token.verify(token, privateKey);
        req.user = user;
        return next();
      } catch (e) {
        error.message = "invalid/expired Token";
        return next(error);
      }
    }
    error.message = "Authorization token must be Bearer [token]";
    return next(error);
  }
  error.message = "Authorization Token is Required";
  return next(error);
};
