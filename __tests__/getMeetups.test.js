const express = require("express");
const router = require("../src/loader/routing");
const request = require("supertest");

const app = express();
app.use(express.json());
app.use(router);

const server = app.listen(80, () => {});

describe("testing signin", () => {
  it("POST /api/auth/signin - unsuccess", (done) => {
    const validatedData = {
      email: "aa@example.com",
      password: "string",
    };
    request(app)
      .post("/api/auth/signin")
      .send(validatedData)
      .end((err, res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.statusCode).toEqual(401);
        done();
      });
  });
  it("POST /api/auth/signin - success", (done) => {
    const validatedData = {
      email: "userzzz@example.com",
      password: "string",
    };
    request(app)
      .post("/api/auth/signin")
      .send(validatedData)
      .end((err, res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.statusCode).toEqual(200);
        done();
      });
  });
});

afterAll(() => {
  server.close();
});
