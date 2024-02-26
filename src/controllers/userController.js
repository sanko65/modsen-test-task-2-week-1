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

    return res.status(StatusCodes.OK).json(
      new Response({
        accessToken: `Bearer ${accessToken}`,
      })
    );
  }
}

module.exports = new UserController();
