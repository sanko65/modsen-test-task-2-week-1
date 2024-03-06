const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
} = require("../common/helpers/createJWt");
const repo = require("../repositories/authRepo");
const {
  UnauthorizedError,
  BadRequestError,
} = require("../common/errors/index");

class AuthService {
  async signup(email, role, password) {
    const user = await repo.findUserByEmail(email);

    if (user) {
      throw new BadRequestError("Invalid email or password");
    }

    const hash_password = bcrypt.hashSync(password, 15);

    await repo.createUser(email, role, hash_password);
  }

  async signin(email, password) {
    const user = await repo.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = createAccessToken(user.user_id, user.email, user.role);

    const refreshToken = createRefreshToken(
      user.user_id,
      user.email,
      user.role
    );

    await repo.updateUserRefreshToken(user.user_id, refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken) {
    const { id, email, role } = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY
    );

    const user = await repo.takeUserByRefreshToken(id, email, refreshToken);

    if (!user) {
      throw new UnauthorizedError("Problem with refresh token");
    }

    return createAccessToken(id, email, role);
  }
}

module.exports = new AuthService();
