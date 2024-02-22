const service = require("./services/authService");

class UserController {
  async signup(req, res) {
    const { email, role, password } = req.validatedData;

    await service.signup(email, role, password);

    return res.status(201).json("User was added");
  }

  async signin(req, res) {
    const { email, password } = req.validatedData;

    const authResult = await service.signin(email, password);

    if (!authResult) {
      return res.status(401).json("Invalid email or password");
    }

    return res.status(200).json({
      accessToken: `Bearer ${authResult.accessToken}`,
      refreshToken: authResult.refreshToken,
    });
  }
}

module.exports = new UserController();
