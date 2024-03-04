const { StatusCodes } = require("http-status-codes");
const service = require("../services/authService");
const setCookie = require("../common/helpers/setCookie");
const sendResponce = require("../common/helpers/sendResponce");

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
}

module.exports = new UserController();
