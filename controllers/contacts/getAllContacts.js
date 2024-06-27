const { Contact } = require("../../models/contact");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const { favorite } = req.query;

    const skip = (page - 1) * limit;

    const result = await Contact.find(
      { owner, favorite: favorite === "true" },
      "-createdAt, -updatedAt",
      { skip, limit }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = getAllContacts;