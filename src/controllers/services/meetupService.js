const repo = require("../repositories/meetupRepo");

class MeetupService {
  async getMeetups(filters) {
    const fieldNames = ["name", "description", "keywords", "time", "place"];

    const sortFields = Array.isArray(filters.sort_by)
      ? filters.sort_by
      : [filters.sort_by].filter(Boolean);

    const sortOrders = Array.isArray(filters.order)
      ? filters.order
      : [filters.order].filter(Boolean);

    const limit = Number.isInteger(+filters.limit) ? filters.limit : undefined;
    const offset = Number.isInteger(+filters.offset)
      ? filters.offset
      : undefined;

    let whereClause = {};
    for (let filter in filters) {
      if (fieldNames.includes(filter)) {
        whereClause[filter] = {
          contains: filters[filter],
          mode: "insensitive",
        };
      }
    }

    let orderByClause = {};
    if (sortFields.length) {
      for (let i = 0; i < sortFields.length; i++) {
        if (
          fieldNames.includes(sortFields[i]) ||
          sortFields[i] === "meetup_id"
        ) {
          const order = sortOrders[i] || `asc`;
          orderByClause[sortFields[i]] = order;
        }
      }
    } else {
      orderByClause["meetup_id"] = "asc";
    }

    return await repo.getMeetups(whereClause, orderByClause, limit, offset);
  }

  async getMeetupsById(id) {
    return await repo.getMeetupsById(id);
  }

  async createMeetup(name, description, keywords, time, place, user_id) {
    return await repo.createMeetup(
      name,
      description,
      keywords,
      time,
      place,
      user_id
    );
  }

  async updateMeetup(
    meetup_id,
    name,
    description,
    keywords,
    time,
    place,
    user_id
  ) {
    const meetup = await repo.getMeetupsById(meetup_id);

    if (!meetup) {
      return "404";
    }

    if (user_id !== meetup.creator_id) {
      return "403";
    }

    await repo.updateMeetup(
      meetup_id,
      name,
      description,
      keywords,
      time,
      place
    );
  }

  async deleteMeetup(meetup_id, user_id) {
    const meetup = await repo.getMeetupsById(meetup_id);

    if (!meetup) {
      return "404";
    }

    console.log(user_id, meetup.creator_id);
    if (user_id !== meetup.creator_id) {
      return "403";
    }

    await repo.deleteMeetupFromUttendees(meetup_id);

    await repo.deleteMeetup(meetup_id);
  }

  async attendMeetup(meetup_id, user_id) {
    const meetup = repo.getMeetupsById(meetup_id);

    if (!meetup) {
      return "404";
    }

    await repo.attendMeetup(meetup_id, user_id);
  }
}

module.exports = new MeetupService();
