const service = require("./services/meetupService");

class MeetupController {
  async getMeetups(req, res) {
    const filters = req.query;

    const meetups = await service.getMeetups(filters);

    if (!meetups.length) {
      return res.status(204).json();
    }
    return res.status(200).json(meetups);
  }

  async getMeetupsById(req, res) {
    const { id } = req.validatedData;

    const meetup = await service.getMeetupsById(id);

    if (!meetup) {
      return res.status(204).json();
    }

    return res.status(200).json(meetup);
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
    if (!newMeetup) res.satus(400);

    return res.status(201).json(newMeetup);
  }

  async updateMeetup(req, res) {
    const { meetup_id, name, description, keywords, time, place } =
      req.validatedData;
    const user_id = req.user.user_id;

    const updateResult = await service.updateMeetup(
      meetup_id,
      name,
      description,
      keywords,
      time,
      place,
      user_id
    );

    if (updateResult === "404")
      return res.status(404).json(`No meetup with id ${meetup_id}`);
    if (updateResult === "403")
      return res.status(403).json("You are not the creator of this meetup");

    return res
      .status(200)
      .json(`Meetup with id ${meetup_id} successfully updated`);
  }

  async deleteMeetup(req, res) {
    const { id } = req.validatedData;
    const { user_id } = req.user;

    const deleteResult = await service.deleteMeetup(id, user_id);

    if (deleteResult === "404") {
      return res.status(404).json(`No meetup with id ${id}`);
    }

    if (deleteResult === "403") {
      return res.status(403).json("You are not the creator of this meetup");
    }

    return res.status(200).json(`Meetup with id ${id} successfully deleted`);
  }

  async attendMeetup(req, res) {
    const { id: meetup_id } = req.validatedData;
    const { user_id } = req.user;

    const attendResult = await service.attendMeetup(meetup_id, user_id);

    if (attendResult === "404") {
      return res.status(404).json(`No meetup with id ${meetup_id}`);
    }

    return res.status(200).json(`You attend to meetup with id ${meetup_id}`);
  }
}

module.exports = new MeetupController();
