const repo = require("../repositories/userRepo");
const {
  getDataFromCache,
  setDataToCache,
} = require("../common/helpers/cacheHelper");

class UserService {
  async takeUserInfo(user_id, email, role) {
    const cachedUser = await getDataFromCache(`user:${user_id}`);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    let attendeesMeetups;
    let createdMeetups;

    if (role === "user" || role === "moderator") {
      attendeesMeetups = await repo.takeUserAttendees(user_id);

      if (role === "moderator") {
        createdMeetups = await repo.takeCreatedMeetups(user_id);
      }
    }

    let { logo_url } = await repo.takeUserLogoUrl(user_id);

    const userInfo = {
      user_id,
      email,
      role,
      attendeesMeetups,
      createdMeetups,
      logo_url,
    };

    await setDataToCache(
      `user:${user_id}`,
      JSON.stringify(userInfo),
      process.env.CACHED_EXPIRATION
    );

    return userInfo;
  }
}

module.exports = new UserService();
