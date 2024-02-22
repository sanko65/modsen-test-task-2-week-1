const jwt = require("jsonwebtoken");
const repo = require("../repositories/userRepo");

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
    const { id, email } = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    const user = await repo.takeUserByRefreshToken(id, email, refreshToken);

    if (!user) {
      return null;
    }

    return jwt.sign({ id, email }, process.env.JWT_ACCESS_KEY, {
      expiresIn: +process.env.JWT_EXPIRATION,
    });
  }
}

module.exports = new UserService();
