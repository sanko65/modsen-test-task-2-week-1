const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const validator = require("../validators/userValidator");

class UserController {
  async signup(req, res) {
    const { error, value } = validator.validateSignup(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, role, password } = value;

    const salt = bcrypt.genSaltSync(15);
    const hash_password = bcrypt.hashSync(password, salt);

    try {
      await db.query(
        `INSERT INTO "user" (email, role, password) values ($1, $2, $3) RETURNING *`,
        [email, role, hash_password]
      );
      return res.status(201).json("User was added");
    } catch (error) {
      return res.status(500).json(error.detail);
    }
  }

  async signin(req, res) {
    const { error, value } = validator.validateSignin(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    await db.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) {
          return res.status(500).json(error);
        }
        if (!results.rows.length) {
          return res.status(204).json();
        }
        const isValidPassword = bcrypt.compareSync(
          password,
          results.rows[0].password
        );
        if (!isValidPassword)
          return res.status(401).json("Password is incorrect");

        const accessToken = jwt.sign(
          {
            id: results.rows[0].user_id,
            email: results.rows[0].email,
            role: results.rows[0].role,
          },
          process.env.JWT_ACCESS_KEY,
          {
            expiresIn: +process.env.JWT_EXPIRATION,
          }
        );
        const refreshToken = jwt.sign(
          {
            id: results.rows[0].user_id,
            email: results.rows[0].email,
            role: results.rows[0].role,
          },
          process.env.JWT_REFRESH_KEY,
          {
            expiresIn: +process.env.JWT_REFRESH_EXPIRATION,
          }
        );

        try {
          db.query(`UPDATE "user" SET refresh_token = $1 WHERE user_id = $2`, [
            refreshToken,
            results.rows[0].user_id,
          ]);
        } catch (e) {
          return res.status(500).json(e);
        }
        return res.status(200).json({
          accessToken: `Bearer ${accessToken}`,
          refreshToken,
        });
      }
    );
  }

  async takeUserInfo(req, res) {
    const { error, value } = validator.validateTakeUserInfo(req.user);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { user_id, email, role } = value;

    try {
      const attendees = await db.query(
        "SELECT m.* FROM meetup m JOIN attendees a ON m.meetup_id = a.meetup_id WHERE a.user_id = $1",
        [user_id]
      );

      if (role === "user")
        return res.status(200).json({
          user_id,
          email,
          role,
          attendees: attendees.rows,
        });

      const createdMeetups = await db.query(
        "SELECT * FROM meetup WHERE creator_id = $1",
        [user_id]
      );

      return res.status(200).json({
        user_id,
        email,
        role,
        attendees: attendees.rows,
        createdMeetups: createdMeetups.rows,
      });
    } catch (error) {
      return res.status(500).json();
    }
  }

  async refreshToken(req, res) {
    const { error, value } = validator.validateRefreshToken(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { refreshToken } = value;

    try {
      const { id, email } = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY
      );

      const results = await db.query(
        `SELECT * FROM "user" WHERE user_id = $1 AND email = $2 AND refresh_token = $3`,
        [id, email, refreshToken]
      );

      if (!results.rows.length) {
        return res.status(401).json("Invalid refresh token");
      }

      const accessToken = jwt.sign({ id, email }, process.env.JWT_ACCESS_KEY, {
        expiresIn: +process.env.JWT_EXPIRATION,
      });

      return res.status(200).json({
        accessToken: `Bearer ${accessToken}`,
      });
    } catch (error) {
      return res.status(401).json(error.message);
    }
  }
}

module.exports = new UserController();
