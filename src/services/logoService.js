const repo = require("../repositories/logoRepo");
const gcloudFileStream = require("../common/helpers/uploadLogoHelper");
const { UploadLogoError, DeleteLogoError } = require("../common/errors/index");

class LogoService {
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

module.exports = new LogoService();
