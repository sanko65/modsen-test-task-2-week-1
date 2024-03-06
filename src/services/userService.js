const repo = require("../repositories/userRepo");

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
}

module.exports = new UserService();
