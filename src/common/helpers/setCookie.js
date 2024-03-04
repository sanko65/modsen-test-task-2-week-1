function setCookie(res, cookieName, token) {
  let modifiedRes = res;
  if (cookieName === "accessToken") {
    modifiedRes = res.cookie(cookieName, token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_JWT_EXPIRATION,
    });
  } else {
    modifiedRes = res.cookie(cookieName, token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_JWT_REFRESH_EXPIRATION,
    });
  }
  return modifiedRes;
}

module.exports = setCookie;
