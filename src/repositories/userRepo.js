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

  async takeUserWithUpdatedLogo(user_id, fileName) {
    return await prisma.user.update({
      where: { user_id },
      data: {
        logo_url: fileName
          ? `${process.env.GC_BUCKET_PUBLIC_LINK}${fileName}`
          : null,
      },
    });
  }

  async takeUserLogoUrl(user_id) {
    return await prisma.user.findUnique({
      where: { user_id },
      select: { logo_url: true },
    });
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}

module.exports = new UserRepo();
