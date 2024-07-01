const { HttpError } = require("../../helpers/HttpError");
const { Contact } = require("../../models/contact");

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = updateContact;