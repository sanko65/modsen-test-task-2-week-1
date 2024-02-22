const prisma = require("../../database/prisma");

class MeetupRepo {
  async getMeetups(whereClause, orderByClause, limit, offset) {
    return await prisma.meetup.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit ? +limit : undefined,
      skip: offset ? +offset : undefined,
    });
  }

  async getMeetupsById(id) {
    return await prisma.meetup.findUnique({
      where: {
        meetup_id: parseInt(id),
      },
    });
  }

  async createMeetup(name, description, keywords, time, place, user_id) {
    return await prisma.meetup.create({
      data: {
        name,
        description,
        keywords: { set: keywords },
        time,
        place,
        creator_id: user_id,
      },
    });
  }

  async updateMeetup(meetup_id, name, description, keywords, time, place) {
    await prisma.meetup.update({
      where: {
        meetup_id: parseInt(meetup_id),
      },
      data: {
        name,
        description,
        keywords: { set: keywords },
        time,
        place,
      },
    });
  }

  async deleteMeetupFromUttendees(id) {
    await prisma.attendees.deleteMany({
      where: {
        meetup_id: parseInt(id),
      },
    });
  }

  async deleteMeetup(id) {
    await prisma.meetup.delete({
      where: {
        meetup_id: parseInt(id),
      },
    });
  }

  async attendMeetup(meetup_id, user_id) {
    await prisma.attendees.create({
      data: {
        user_id: parseInt(user_id),
        meetup_id: parseInt(meetup_id),
      },
    });
  }
}

module.exports = new MeetupRepo();
