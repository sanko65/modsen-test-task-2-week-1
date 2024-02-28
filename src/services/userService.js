const jwt = require("jsonwebtoken");
const repo = require("../repositories/userRepo");
const { createAccessToken } = require("../common/helpers/createJWt");
const { fileName, gcStream } = require("../common/helpers/uploadLogoHelper");
const {
  UnauthorizedError,
  UploadLogoError,
  DeleteLogoError,
} = require("../common/errors/index");

class UserService {
  async takeUserInfo(user_id, email, role) {
    let attendeesMeetups;
    let createdMeetups;

    if (role === "user" || role === "moderator") {
      attendeesMeetups = await repo.takeUserAttendees(user_id);

      if (role === "moderator") {
        createdMeetups = await repo.takeCreatedMeetups(user_id);
      }
    }

    let { logo_url } = await repo.takeUserLogoUrl(user_id);

    return {
      user_id,
      email,
      role,
      attendeesMeetups,
      createdMeetups,
      logo_url,
    };
  }

  async refreshAccessToken(refreshToken) {
    const { id, email, role } = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY
    );

    const user = await repo.takeUserByRefreshToken(id, email, refreshToken);

    if (!user) {
      throw new UnauthorizedError("Problem with refresh token");
    }

    return createAccessToken(id, email, role);
  }

  async uploadLogo(user_id, logoBuffer) {
    if (!logoBuffer) throw new UploadLogoError("Problem with upload logo");

    gcStream.end(logoBuffer);

    await new Promise((resolve, reject) => {
      gcStream.on("finish", resolve);
      gcStream.on("error", reject);
    }).catch(() => {
      throw new UploadLogoError("Problem with upload logo");
    });

    const updatedUser = await repo.takeUserWithUpdatedLogo(user_id, fileName);

    if (!updatedUser.logo_url)
      throw new UploadLogoError("Problem with upload logo");
  }

  async deleteLogo(user_id, email) {
    const user = await repo.findUserByEmail(email);

    if (!user) {
      throw new DeleteLogoError("Problem with delete logo");
    }

    const updatedUser = await repo.takeUserWithUpdatedLogo(user_id, "");

    if (updatedUser.logo_url)
      throw new DeleteLogoError("Problem with delete logo");
  }
}

module.exports = new UserService();
