const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");
const validator = require("../validators/userValidator");

class UserController {
  async signup(req, res) {
    const { error, value } = validator.validateSignup(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, role, password } = value;

    const hash_password = bcrypt.hashSync(password, 15);

    try {
      await prisma.user.create({
        data: {
          email,
          role,
          password: hash_password,
        },
      });
      return res.status(201).json("User was added");
    } catch (error) {
      return res.status(500).json(error.name);
    }
  }

  async signin(req, res) {
    const { error, value } = validator.validateSignin(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    try {
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
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async takeUserInfo(req, res) {
    const { error, value } = validator.validateTakeUserInfo(req.user);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { user_id, email, role } = value;

    try {
      let attendeesMeetups;
      let createdMeetups;

      if (role === "user" || role === "moderator") {
        attendeesMeetups = await prisma.meetup.findMany({
          where: {
            attendees: { some: { user_id: user_id } },
          },
        });

        if (role === "moderator") {
          createdMeetups = await prisma.meetup.findMany({
            where: {
              creator_id: user_id,
            },
          });
        }
      }

      if (!attendeesMeetups && !createdMeetups) {
        return res.status(404).json({ message: "No meetups found" });
      }

      return res.status(200).json({
        user_id,
        email,
        role,
        attendeesMeetups,
        createdMeetups,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    const { error, value } = validator.validateRefreshToken(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { refreshToken } = value;

    try {
      const { id, email } = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY
      );

      const user = await prisma.user.findFirst({
        where: {
          AND: [
            { user_id: parseInt(id) },
            { email: email },
            { refresh_token: refreshToken },
          ],
        },
      });

      if (!user) {
        return res.status(401).json("Invalid refresh token");
      }

      const accessToken = jwt.sign({ id, email }, process.env.JWT_ACCESS_KEY, {
        expiresIn: +process.env.JWT_EXPIRATION,
      });

      return res.status(200).json({
        accessToken: `Bearer ${accessToken}`,
      });
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }
}

module.exports = new UserController();
