const jwt = require("jsonwebtoken");
const repo = require("../repositories/userRepo");
const { createAccessToken } = require("../common/helpers/createJWt");
const { UnauthorizedError } = require("../common/errors/index");

class UserService {
  async takeUserInfo(user_id, email, role) {
    let attendeesMeetups;
    let createdMeetups;

    if (role === "user" || role === "moderator") {
      attendeesMeetups = await repo.takeUserAttendees(user_id);

      if (role === "moderator") {
        createdMeetups = await repo.takeCreatedMeetups(user_id);
      }
    }

    return { user_id, email, role, attendeesMeetups, createdMeetups };
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

module.exports = new UserService();
