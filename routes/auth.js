const express = require("express");
const { validateBody } = require("../helpers/validateBody");
const {
  schemas: { regisSchema, authSchema },
} = require("../models/user");

const {
  registration,
  authorization,
  getCurrentUser,
  logout,
  subscriptionUpdate,
  updateAvatar,
} = require("../controllers/index");
const { authenticate } = require("../middlewares/authenticate");
const { upload } = require("../middlewares/upload");

const router = express.Router();

router.post("/register", validateBody(regisSchema), registration);
router.post("/login", validateBody(authSchema), authorization);
router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrentUser);

router.patch("/", authenticate, subscriptionUpdate);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
