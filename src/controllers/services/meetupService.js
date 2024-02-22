const { BadRequestError, ForbiddenError } = require("../../errors/index");
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
      throw new BadRequestError(`No meetup with id ${meetup_id}`);
    }

    if (user_id !== meetup.creator_id) {
      throw new ForbiddenError("You are not the creator of this meetup");
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
      throw new BadRequestError(`No meetup with id ${meetup_id}`);
    }

    if (user_id !== meetup.creator_id) {
      throw new ForbiddenError("You are not the creator of this meetup");
    }

    await repo.deleteMeetupFromUttendees(meetup_id);

    await repo.deleteMeetup(meetup_id);
  }

  async attendMeetup(meetup_id, user_id) {
    const meetup = await repo.getMeetupsById(meetup_id);

    if (!meetup) {
      throw new BadRequestError(`No meetup with id ${meetup_id}`);
    }

    const isAttendMeetup = await repo.checkAttendMeetup(meetup_id, user_id);

    if (isAttendMeetup) {
      throw new BadRequestError(
        `You already attend to meetup with id: ${meetup_id}`
      );
    }

    await repo.attendMeetup(meetup_id, user_id);
  }
}

module.exports = new MeetupService();
