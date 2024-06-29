const { User } = require("../../models/user");
const { HttpError } = require("../../helpers/HttpError");

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    next(HttpError(204, "No Content"));
  } catch (error) {
    next(error);
  }
};

module.exports = logout;