const { StatusCodes } = require("http-status-codes");
const service = require("../services/authService");
const Response = require("../common/response/Response");

class UserController {
  async signup(req, res) {
    const { email, role, password } = req.validatedData;

    await service.signup(email, role, password);

    return res
      .status(StatusCodes.CREATED)
      .json(new Response(`User ${email} has been successfully registered`));
  }

  async signin(req, res) {
    const { email, password } = req.validatedData;

    const { accessToken, refreshToken } = await service.signin(email, password);

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 300000 });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 600000,
    });

    return res.status(StatusCodes.OK).json(new Response("Success signin"));
  }
}

module.exports = new UserController();
