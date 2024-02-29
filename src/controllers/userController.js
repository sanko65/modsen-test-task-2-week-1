const { StatusCodes } = require("http-status-codes");
const service = require("../services/userService");
const Response = require("../common/response/Response");

class UserController {
  async takeUserInfo(req, res) {
    const { user_id, email, role } = req.validatedData;

    const userInfo = await service.takeUserInfo(user_id, email, role);

    return res.status(StatusCodes.OK).json(new Response(userInfo));
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.validatedData;

    const accessToken = await service.refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 300000 });

    return res
      .status(StatusCodes.OK)
      .json(new Response("Access token refreshed successfully"));
  }

  async uploadLogo(req, res) {
    const { user_id } = req.validatedData;
    const logoBuffer = req.file.buffer;

    await service.uploadLogo(user_id, logoBuffer);

    return res
      .status(StatusCodes.OK)
      .json(new Response("User logo was uploaded"));
  }

  async deleteLogo(req, res) {
    const { user_id, email } = req.validatedData;

    await service.deleteLogo(user_id, email);

    return res
      .status(StatusCodes.OK)
      .json(new Response("User logo was deleted"));
  }
}

module.exports = new UserController();
