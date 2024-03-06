const prisma = require("../database/prisma");

class UserRepo {
  async takeUserWithUpdatedLogo(user_id, fileName) {
    return await prisma.user.update({
      where: { user_id },
      data: {
        logo_url: fileName
          ? `${process.env.GC_BUCKET_PUBLIC_LINK}${fileName}`
          : null,
      },
    });
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}

module.exports = new UserRepo();
