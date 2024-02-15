const db = require("../db");
const validator = require("../validators/meetupValidator");

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

    const limit = Number.isInteger(+req.query.limit) ? req.query.limit : 0;
    const offset = Number.isInteger(+req.query.offset) ? req.query.offset : 0;

    let filterSubquery = ``;
    for (let filter in filters) {
      if (fieldNames.includes(filter)) {
        if (filterSubquery.length) filterSubquery += " AND ";
        if (filter === "time") {
          filterSubquery += ` ${filter}::date = '${filters[filter]}'::date `;
        } else if (filter === "keywords") {
          filterSubquery += ` EXISTS (
            SELECT *
            FROM unnest(keywords) AS element
            WHERE element ILIKE '%${filters[filter]}%') `;
        } else {
          filterSubquery += ` ${filter} ILIKE '%${filters[filter]}%' `;
        }
      }
    }
    if (filterSubquery) {
      filterSubquery = ` WHERE ${filterSubquery}`;
    }

    let sortSubquery = ``;
    if (sortFields) {
      for (let i = 0; i < sortFields.length; i++) {
        if (fieldNames.includes(sortFields[i])) {
          const order = sortOrders[i] || `ASC`;
          sortSubquery += `${sortFields[i]} ${order}`;
          if (i !== sortFields.length - 1) {
            sortSubquery += `, `;
          }
        }
      }
    } else {
      sortSubquery = " ORDER BY meetup_id ASC";
    }
    if (sortSubquery) {
      sortSubquery = ` ORDER BY ${sortSubquery}`;
    }

    let pageSubquery = ``;
    if (limit) pageSubquery += `LIMIT ${limit} `;
    if (offset) pageSubquery += `OFFSET ${offset}`;

    await db.query(
      `SELECT * FROM meetup ${filterSubquery} ${sortSubquery} ${pageSubquery}`,
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        if (!results.rows.length) {
          return res.status(204).json();
        }
        return res.status(200).json(results.rows);
      }
    );
  }

  async getMeetupsById(req, res) {
    const { error, value } = validator.validateMeetupId(req.params);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = value;

    await db.query(
      "SELECT * FROM meetup WHERE meetup_id = $1",
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        if (!results.rows.length) {
          return res.status(204).json();
        }
        return res.status(200).json(results.rows[0]);
      }
    );
  }

  async createMeetup(req, res) {
    const { error, value } = validator.validateCreateMeetup(req.body);
    const { user_id } = req.user;

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, description, keywords, time, place } = value;

    try {
      const newMeetup = await db.query(
        "INSERT INTO meetup (name, description, keywords, time, place, creator_id) values ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, description, keywords, time, place, user_id]
      );

      return res.status(201).json(newMeetup.rows[0]);
    } catch (error) {
      return res.status(500).json();
    }
  }

  async updateMeetup(req, res) {
    const { error, value } = validator.validateUpdateMeetup(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id, name, description, keywords, time, place } = value;

    const meetup = await db.query("SELECT * FROM meetup WHERE meetup_id = $1", [
      id,
    ]);

    if (meetup.rows.length === 0) {
      return res.status(404).json(`No meetup with id ${id}`);
    }

    if (req.user.user_id !== meetup.rows[0].creator_id) {
      return res.status(403).json("You are not the creator of this meetup");
    }

    await db.query(
      "UPDATE meetup set name = $1, description = $2, keywords = $3, time = $4, place = $5 where meetup_id = $6 RETURNING *",
      [name, description, keywords, time, place, id],
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        if (!results.rowCount) {
          return res.status(404).json(`No meetup with id ${id}`);
        }
        return res
          .status(200)
          .json(`Meetup with id ${id} successfully updated`);
      }
    );
  }

  async deleteMeetup(req, res) {
    const { error, value } = validator.validateMeetupId(req.params);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = value;

    const meetup = await db.query("SELECT * FROM meetup WHERE meetup_id = $1", [
      id,
    ]);

    if (meetup.rows.length === 0) {
      return res.status(404).json(`No meetup with id ${id}`);
    }

    if (req.user.user_id !== meetup.rows[0].creator_id) {
      return res.status(403).json("You are not the creator of this meetup");
    }

    await db.query(
      "DELETE FROM meetup where meetup_id = $1",
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        if (!results.rowCount) {
          return res.status(404).json(`No meetup with id ${id}`);
        }
        return res
          .status(200)
          .json(`Meetup with id ${id} successfully deleted`);
      }
    );
  }

  async attendMeetup(req, res) {
    const meetup_id = req.params.id;
    const { user_id } = req.user;
    await db.query(
      "INSERT INTO attendees (user_id, meetup_id) VALUES($1, $2)",
      [user_id, meetup_id],
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        if (!results.rowCount) {
          return res.status(404).json(`No meetup with id ${meetup_id}`);
        }
        return res
          .status(200)
          .json(`You attend to meetup with id ${meetup_id}`);
      }
    );
  }
}

module.exports = new MeetupController();
