const db = require("../db");
const validator = require("../validators/meetupValidator");

class MeetupController {
  async getMeetups(req, res) {
    const fieldNames = ["name", "description", "keywords", "time", "place"];
    const filters = req.query;

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
    const helperSubquery = ` WHERE ${filterSubquery}`;

    await db.query(
      `SELECT * FROM meetup ${helperSubquery.length > 7 ? helperSubquery : ""}`,
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

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, description, keywords, time, place } = value;

    try {
      const newMeetup = await db.query(
        "INSERT INTO meetup (name, description, keywords, time, place) values ($1, $2, $3, $4, $5) RETURNING *",
        [name, description, keywords, time, place]
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
}

module.exports = new MeetupController();
