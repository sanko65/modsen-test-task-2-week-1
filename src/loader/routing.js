const Router = require("express");

const meetupRouter = require("../routes/meetupRoutes");
const userRouter = require("../routes/userRoutes");
const authRouter = require("../routes/authRoutes");

const router = new Router();

router.use("/api", meetupRouter);
router.use("/api/user", userRouter);
router.use("/api/auth", authRouter);

module.exports = router;
