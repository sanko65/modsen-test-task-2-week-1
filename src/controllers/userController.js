const { StatusCodes } = require("http-status-codes");
const service = require("../services/userService");
const sendResponce = require("../common/helpers/sendResponce");

class UserController {
  async takeUserInfo(req, res) {
    const { user_id, email, role } = req.validatedData;

    const userInfo = await service.takeUserInfo(user_id, email, role);

    return sendResponce(res, StatusCodes.OK, userInfo);
  }

  async uploadLogo(req, res) {
    const { user_id } = req.validatedData;
    const logoBuffer = req.file.buffer;

    await service.uploadLogo(user_id, logoBuffer);

    return sendResponce(res, StatusCodes.OK, "User logo was uploaded");
  }

  async deleteLogo(req, res) {
    const { user_id, email } = req.validatedData;

    await service.deleteLogo(user_id, email);

    return sendResponce(res, StatusCodes.OK, "User logo was deleted");
  }
}

module.exports = new UserController();
