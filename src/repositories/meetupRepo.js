const prisma = require("../database/prisma");

class MeetupRepo {
  async getMeetups(whereClause, orderByClause, limit, offset) {
    return await prisma.meetup.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
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
    return prisma.meetup.create({
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

  async attendMeetup(meetup_id, user_id) {
    return prisma.attendees.create({
      data: {
        user_id: parseInt(user_id),
        meetup_id: parseInt(meetup_id),
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

  deleteMeetupFromUttendees(id) {
    return prisma.attendees.deleteMany({
      where: {
        meetup_id: parseInt(id),
      },
    });
  }

  deleteMeetup(id) {
    return prisma.meetup.delete({
      where: {
        meetup_id: parseInt(id),
      },
    });
  }

  async asyncAttendMeetup(meetup_id, user_id) {
    await prisma.attendees.create({
      data: {
        user_id: parseInt(user_id),
        meetup_id: parseInt(meetup_id),
      },
    });
  }

  async checkAttendMeetup(meetup_id, user_id) {
    return await prisma.attendees.findUnique({
      where: {
        user_id_meetup_id: {
          user_id: parseInt(user_id),
          meetup_id: parseInt(meetup_id),
        },
      },
    });
  }

  async leaveMeetup(meetup_id, user_id) {
    await prisma.attendees.delete({
      where: {
        user_id_meetup_id: {
          user_id: parseInt(user_id),
          meetup_id: parseInt(meetup_id),
        },
      },
    });
  }
}

module.exports = new MeetupRepo();
