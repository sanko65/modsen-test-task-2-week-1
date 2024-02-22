const service = require("./services/userService");

class UserController {
  async takeUserInfo(req, res) {
    const { user_id, email, role } = req.validatedData;

    const userInfo = await service.takeUserInfo(user_id, email, role);

    return res.status(200).json({
      userInfo,
    });
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.validatedData;

    const accessToken = await service.refreshAccessToken(refreshToken);

    if (!accessToken)
      return res.status(401).json({ message: "Problem with refresh token" });

    return res.status(200).json({
      accessToken: `Bearer ${accessToken}`,
    });
  }
}

module.exports = new UserController();
