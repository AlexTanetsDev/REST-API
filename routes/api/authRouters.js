const express = require("express");

const authCtrl = require("../../controllers/uathControllers");

const { validateBody, authentificate, upload } = require("../../middlewares");

const { schemas } = require("../../models/user");

const authRouter = express.Router();

// signup
authRouter.post(
  "/register",
  validateBody(schemas.authSchema),
  authCtrl.register
);

// signin
authRouter.post("/login", validateBody(schemas.authSchema), authCtrl.login);

// get current user
authRouter.get("/current", authentificate, authCtrl.getCurrent);

// logout
authRouter.post("/logout", authentificate, authCtrl.logout);

// update subscription

authRouter.patch(
  "/",
  authentificate,
  validateBody(schemas.updateSubscrition),
  authCtrl.subscription
);

// Add user avatar
authRouter.patch(
  "/avatars",
  authentificate,
  upload.single("avatar"),
  authCtrl.updateAvatar
);

module.exports = authRouter;
