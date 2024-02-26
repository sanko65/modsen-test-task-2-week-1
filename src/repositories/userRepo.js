const prisma = require("../database/prisma");

class UserRepo {
  async takeUserAttendees(user_id) {
    return await prisma.meetup.findMany({
      where: {
        attendees: { some: { user_id: user_id } },
      },
    });
  }

  async takeCreatedMeetups(user_id) {
    return await prisma.meetup.findMany({
      where: {
        creator_id: user_id,
      },
    });
  }

  async takeUserByRefreshToken(id, email, refreshToken) {
    return await prisma.user.findFirst({
      where: {
        AND: [
          { user_id: parseInt(id) },
          { email: email },
          { refresh_token: refreshToken },
        ],
      },
    });
  }
}

module.exports = new UserRepo();
