const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

class UserController {
  async signup(req, res) {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(15);
    const hash_password = bcrypt.hashSync(password, salt);

    try {
      await db.query(
        `INSERT INTO "user" (email, password) values ($1, $2) RETURNING *`,
        [email, hash_password]
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

        const token = jwt.sign(
          {
            id: results.rows[0].user_id,
            email: results.rows[0].email,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: 3600,
          }
        );
        return res.status(200).json({
          token: `Bearer ${token}`,
        });
      }
    );
  }

  async takeUserInfo(req, res) {
    try {
      const { user_id, email } = req.user;
      res.status(200).json({ user_id, email });
    } catch (err) {
      res.status(500).json("Internal error");
    }
  }
}

module.exports = new UserController();
