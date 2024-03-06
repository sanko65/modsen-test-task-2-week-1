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

  async takeUserLogoUrl(user_id) {
    return await prisma.user.findUnique({
      where: { user_id },
      select: { logo_url: true },
    });
  }
}

module.exports = new UserRepo();
