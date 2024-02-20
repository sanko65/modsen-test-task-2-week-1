const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");

class UserController {
  async signup(req, res) {
    const { email, role, password } = req.validatedData;

    const hash_password = bcrypt.hashSync(password, 15);

    await prisma.user.create({
      data: {
        email,
        role,
        password: hash_password,
      },
    });
    return res.status(201).json("User was added");
  }

  async signin(req, res) {
    const { email, password } = req.validatedData;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(204).json();
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json("Password is incorrect");
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

    await prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        refresh_token: refreshToken,
      },
    });

    return res.status(200).json({
      accessToken: `Bearer ${accessToken}`,
      refreshToken,
    });
  }
}

module.exports = new UserController();
