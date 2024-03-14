const { StatusCodes } = require("http-status-codes");
const service = require("../services/authService");
const setCookie = require("../common/helpers/setCookie");
const sendResponce = require("../common/helpers/sendResponce");
const prisma = require("../database/prisma");

class UserController {
  async signup(req, res) {
    const { email, role, password } = req.validatedData;

    await service.signup(email, role, password);

    return sendResponce(
      res,
      StatusCodes.CREATED,
      `User ${email} has been successfully registered`
    );
  }

  async signin(req, res) {
    const { email, password } = req.validatedData;

    const { accessToken, refreshToken } = await service.signin(email, password);

    res = setCookie(res, "accessToken", accessToken);
    res = setCookie(res, "refreshToken", refreshToken);

    return sendResponce(res, StatusCodes.OK, "Success signin");
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.validatedData;

    const accessToken = await service.refreshAccessToken(refreshToken);

    res = setCookie(res, "accessToken", accessToken);

    return sendResponce(
      res,
      StatusCodes.OK,
      "Access token refreshed successfully"
    );
  }

  async googleAuth(req, res) {
    const email = req.user.emails[0].value;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const { accessToken, refreshToken } = await service.signin(
        email,
        "googleAuth"
      );

      res = setCookie(res, "accessToken", accessToken);
      res = setCookie(res, "refreshToken", refreshToken);

      return sendResponce(res, StatusCodes.OK, "Success signin");
    } else {
      await service.signup(email, "user", "googleAuth");

      return sendResponce(
        res,
        StatusCodes.CREATED,
        `User ${email} has been successfully registered`
      );
    }
  }
}

module.exports = new UserController();
