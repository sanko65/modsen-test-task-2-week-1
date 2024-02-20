const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database/prisma");

class UserController {
  async takeUserInfo(req, res) {
    const { user_id, email, role } = req.validatedData;

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
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.validatedData;

    const { id, email } = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

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
  }
}

module.exports = new UserController();
