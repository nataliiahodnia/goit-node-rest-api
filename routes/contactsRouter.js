const express = require("express");

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/index");

const { validateBody } = require("../helpers/validateBody");
const { isValidId } = require("../helpers/isValidId");
const {
  schemas: { createContactSchema, updateContactSchema, updateFavorite },
} = require("../models/contact");
const { authenticate } = require("../middlewares/authenticate");

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavorite),
  updateStatusContact
);

module.exports = contactsRouter;