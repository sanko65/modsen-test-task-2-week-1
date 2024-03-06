const repo = require("../repositories/userRepo");
const gcloudFileStream = require("../common/helpers/uploadLogoHelper");
const { UploadLogoError, DeleteLogoError } = require("../common/errors/index");

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

  async uploadLogo(user_id, logoBuffer) {
    if (!logoBuffer) throw new UploadLogoError("Problem with upload logo");
    const { fileName, gcStream } = gcloudFileStream();

    await new Promise((resolve, reject) => {
      gcStream.write(logoBuffer);
      gcStream.end();
      gcStream.on("finish", resolve);
      gcStream.on("error", reject);
    }).catch(() => {
      throw new UploadLogoError("Problem with upload logo");
    });

    gcStream.destroy();

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
