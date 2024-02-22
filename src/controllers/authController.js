const { StatusCodes } = require("http-status-codes");
const service = require("./services/authService");
const Response = require("../response/Response");

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

    const authResult = await service.signin(email, password);

    return res.status(StatusCodes.OK).json(
      new Response({
        accessToken: `Bearer ${authResult.accessToken}`,
        refreshToken: authResult.refreshToken,
      })
    );
  }
}

module.exports = new UserController();
