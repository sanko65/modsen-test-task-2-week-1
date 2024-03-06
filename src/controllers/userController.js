const { StatusCodes } = require("http-status-codes");
const { takeUserInfo } = require("../services/userService");
const { uploadLogo, deleteLogo } = require("../services/logoService");
const sendResponce = require("../common/helpers/sendResponce");

class UserController {
  async takeUserInfo(req, res) {
    const { user_id, email, role } = req.validatedData;

    const userInfo = await takeUserInfo(user_id, email, role);

    return sendResponce(res, StatusCodes.OK, userInfo);
  }

  async uploadLogo(req, res) {
    const { user_id } = req.validatedData;
    const logoBuffer = req.file.buffer;

    await uploadLogo(user_id, logoBuffer);

    return sendResponce(res, StatusCodes.OK, "User logo was uploaded");
  }

  async deleteLogo(req, res) {
    const { user_id, email } = req.validatedData;

    await deleteLogo(user_id, email);

    return sendResponce(res, StatusCodes.OK, "User logo was deleted");
  }
}

module.exports = new UserController();
