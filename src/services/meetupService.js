const { BadRequestError, ForbiddenError } = require("../common/errors/index");
const {
  getOrderByClause,
  getWhereClause,
} = require("../common/helpers/getMeetupsHelper");
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

    const limit = Number.isInteger(Number(filters.limit))
      ? filters.limit
      : undefined;
    const offset = Number.isInteger(Number(filters.offset))
      ? filters.offset
      : undefined;

    const whereClause = getWhereClause(filters, fieldNames);

    const orderByClause = getOrderByClause(sortFields, fieldNames, sortOrders);

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
