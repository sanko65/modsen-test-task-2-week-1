const { StatusCodes } = require("http-status-codes");
const service = require("../services/meetupService");
const { BadRequestError } = require("../common/errors/index");
const Response = require("../common/response/Response");

class MeetupController {
  async getMeetups(req, res) {
    const filters = req.query;

    const meetups = await service.getMeetups(filters);

    if (!meetups.length) {
      return res.status(StatusCodes.NO_CONTENT).json();
    }
    return res.status(StatusCodes.OK).json(new Response(meetups));
  }

  async getMeetupsById(req, res) {
    const { id } = req.validatedData;

    const meetup = await service.getMeetupsById(id);

    if (!meetup) {
      return res.status(StatusCodes.NO_CONTENT).json();
    }

    return res.status(StatusCodes.OK).json(new Response(meetup));
  }

  async createMeetup(req, res) {
    const { name, description, keywords, time, place } = req.validatedData;
    const { user_id } = req.user;

    const newMeetup = await service.createMeetup(
      name,
      description,
      keywords,
      time,
      place,
      user_id
    );
    if (!newMeetup) throw new BadRequestError("Meetup wasn't added");

    return res.status(StatusCodes.CREATED).json(new Response(newMeetup));
  }

  async updateMeetup(req, res) {
    const { meetup_id, name, description, keywords, time, place } =
      req.validatedData;
    const user_id = req.user.user_id;

    await service.updateMeetup(
      meetup_id,
      name,
      description,
      keywords,
      time,
      place,
      user_id
    );

    return res
      .status(StatusCodes.OK)
      .json(new Response(`Meetup with id ${meetup_id} successfully updated`));
  }

  async deleteMeetup(req, res) {
    const { id } = req.validatedData;
    const { user_id } = req.user;

    await service.deleteMeetup(id, user_id);

    return res
      .status(StatusCodes.OK)
      .json(new Response(`Meetup with id ${id} successfully deleted`));
  }

  async attendMeetup(req, res) {
    const { id: meetup_id } = req.validatedData;
    const { user_id } = req.user;

    await service.attendMeetup(meetup_id, user_id);

    return res
      .status(StatusCodes.OK)
      .json(new Response(`You attend to meetup with id ${meetup_id}`));
  }
}

module.exports = new MeetupController();
