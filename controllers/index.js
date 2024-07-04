const getAllContacts = require("./contacts/getAllContacts");
const getOneContact = require("./contacts/getOneContact");
const deleteContact = require("./contacts/deleteContact");
const createContact = require("./contacts/createContact");
const updateContact = require("./contacts/updateContact");
const updateStatusContact = require("./contacts/updateContact");

const registration = require("./auth/registration");
const authorization = require("./auth/authorization");
const getCurrentUser = require("./auth/getCurrentUser");
const logout = require("./auth/logout");
const subscriptionUpdate = require("./auth/subscriptionUpdate");
const updateAvatar = require("./auth/updateAvatar");
const verifyEmail = require("./auth/verifyEmail");
const resendVerifyEmail = require("./auth/resendVerifyEmail");

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
  registration,
  authorization,
  getCurrentUser,
  logout,
  subscriptionUpdate,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
