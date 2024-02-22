const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repo = require("../repositories/authRepo");

class AuthService {
  async signup(email, role, password) {
    const hash_password = bcrypt.hashSync(password, 15);

    await repo.createUser(email, role, hash_password);
  }

  async signin(email, password) {
    const user = await repo.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    const accessToken = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: +process.env.JWT_EXPIRATION,
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: +process.env.JWT_REFRESH_EXPIRATION,
      }
    );

    await repo.updateUserRefreshToken(user.user_id, refreshToken);
    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
