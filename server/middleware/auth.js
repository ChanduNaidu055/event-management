const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_fallback_key";

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Please Login/SignUp!");
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(403).send("Please Login/SignUp!");
    }
    req.userId = payload.userId;
    next();
  });
};

module.exports = authenticate;
