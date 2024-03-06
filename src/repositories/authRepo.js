const prisma = require("../database/prisma");

class AuthRepo {
  async createUser(email, role, hash_password) {
    await prisma.user.create({
      data: {
        email,
        role,
        password: hash_password,
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

  async updateUserRefreshToken(user_id, refresh_token) {
    await prisma.user.update({
      where: {
        user_id,
      },
      data: {
        refresh_token,
      },
    });
  }

  async takeUserByRefreshToken(id, email, refreshToken) {
    return await prisma.user.findFirst({
      where: {
        AND: [
          { user_id: parseInt(id) },
          { email: email },
          { refresh_token: refreshToken },
        ],
      },
    });
  }
}

module.exports = new AuthRepo();
