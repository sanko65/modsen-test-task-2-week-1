const db = require("../db");

class MeetupController {
  async getMeetups(req, res) {
    await db.query("SELECT * FROM meetup", (error, results) => {
      if (error) {
        return res.status(500).json();
      }
      if (!results.rows.length) {
        return res.status(204).json();
      }
      return res.status(200).json(results.rows);
    });
  }

  async getMeetupsById(req, res) {
    const id = parseInt(req.params.id);

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
    const { name, description, keywords, time, place } = req.body;

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
    const { id, name, description, keywords, time, place } = req.body;

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
    const id = parseInt(req.params.id);

    await db.query(
      "DELETE FROM meetup where meetup_id = $1",
      [id],
      (error, results) => {
        console.log(error || "No error");
        console.log(results);
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
