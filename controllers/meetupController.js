const prisma = require("../database/prisma");

class MeetupController {
  async getMeetups(req, res) {
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const filters = req.query;

    const sortFields = Array.isArray(req.query.sort_by)
      ? req.query.sort_by
      : [req.query.sort_by].filter(Boolean);

    const sortOrders = Array.isArray(req.query.order)
      ? req.query.order
      : [req.query.order].filter(Boolean);

    const limit = Number.isInteger(+req.query.limit)
      ? req.query.limit
      : undefined;
    const offset = Number.isInteger(+req.query.offset)
      ? req.query.offset
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

    try {
      const meetups = await prisma.meetup.findMany({
        where: whereClause,
        orderBy: orderByClause,
        take: limit ? +limit : undefined,
        skip: offset ? +offset : undefined,
      });

      if (!meetups.length) {
        return res.status(204).json();
      }
      return res.status(200).json(meetups);
    } catch (error) {
      return res.status(500).json();
    }
  }

  async getMeetupsById(req, res) {
    const { id } = req.validatedData;

    try {
      const meetup = await prisma.meetup.findUnique({
        where: {
          meetup_id: parseInt(id),
        },
      });

      if (!meetup) {
        return res.status(204).json();
      }

      return res.status(200).json(meetup);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createMeetup(req, res) {
    const { name, description, keywords, time, place } = req.validatedData;
    const { user_id } = req.user;

    try {
      const newMeetup = await prisma.meetup.create({
        data: {
          name,
          description,
          keywords: { set: keywords },
          time,
          place,
          creator_id: user_id,
        },
      });

      return res.status(201).json(newMeetup);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateMeetup(req, res) {
    const { meetup_id, name, description, keywords, time, place } =
      req.validatedData;

    try {
      const meetup = await prisma.meetup.findUnique({
        where: {
          meetup_id: parseInt(meetup_id),
        },
      });

      if (!meetup) {
        return res.status(404).json(`No meetup with id ${meetup_id}`);
      }

      if (req.user.user_id !== meetup.creator_id) {
        return res.status(403).json("You are not the creator of this meetup");
      }

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

      return res
        .status(200)
        .json(`Meetup with id ${meetup_id} successfully updated`);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteMeetup(req, res) {
    const { id } = req.validatedData;

    try {
      const meetup = await prisma.meetup.findUnique({
        where: {
          meetup_id: parseInt(id),
        },
      });

      if (!meetup) {
        return res.status(404).json(`No meetup with id ${id}`);
      }

      if (req.user.user_id !== meetup.creator_id) {
        return res.status(403).json("You are not the creator of this meetup");
      }

      await prisma.attendees.deleteMany({
        where: {
          meetup_id: parseInt(id),
        },
      });

      await prisma.meetup.delete({
        where: {
          meetup_id: parseInt(id),
        },
      });

      return res.status(200).json(`Meetup with id ${id} successfully deleted`);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async attendMeetup(req, res) {
    const { id: meetup_id } = req.validatedData;
    const { user_id } = req.user;

    try {
      const meetup = await prisma.meetup.findUnique({
        where: {
          meetup_id: parseInt(meetup_id),
        },
      });

      if (!meetup) {
        return res.status(404).json(`No meetup with id ${meetup_id}`);
      }

      await prisma.attendees.create({
        data: {
          user_id: parseInt(user_id),
          meetup_id: parseInt(meetup_id),
        },
      });

      return res.status(200).json(`You attend to meetup with id ${meetup_id}`);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new MeetupController();
