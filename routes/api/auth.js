const express = require("express");
const { validateBody } = require("../../helpers/validateBody");
const {
  schemas: { regisSchema, authSchema },
} = require("../../models/user");

const {
  registration,
  authorization,
  getCurrentUser,
  logout,
  subscriptionUpdate,
} = require("../../controllers/index");
const { authenticate } = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(regisSchema), (req, res) => {
  registration(req, res);
});

router.post("/login", validateBody(authSchema), (req, res) => {
  authorization(req, res);
});

router.post("/logout", authenticate, (req, res) => {
  logout(req, res);
});

router.get("/current", authenticate, (req, res) => {
  getCurrentUser(req, res);
});

router.patch("/", authenticate, (req, res) => {
  subscriptionUpdate(req, res);
});

module.exports = router;
