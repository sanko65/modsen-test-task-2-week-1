const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

class UserController {
  async signup(req, res) {
    const { email, role, password } = req.body;
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
    const { email, password } = req.body;

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
    const { user_id, email, role } = req.user;

    await db.query(
      "SELECT m.* FROM meetup m JOIN attendees a ON m.meetup_id = a.meetup_id WHERE a.user_id = $1",
      [user_id],
      (error, results) => {
        if (error) {
          return res.status(500).json();
        }
        return res
          .status(200)
          .json({ user_id, email, role, attendees: results.rows });
      }
    );
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
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
