const jwt = require("jsonwebtoken");

const createAccessToken = function (id, email, role) {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: Number(process.env.JWT_EXPIRATION),
    }
  );
};

const createRefreshToken = function (id, email, role) {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRATION),
    }
  );
};

module.exports = { createAccessToken, createRefreshToken };
