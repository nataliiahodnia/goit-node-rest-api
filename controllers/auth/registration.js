const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { User } = require("../../models/user");
const { HttpError } = require("../../helpers/HttpError");

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid("starter", "business", "pro").optional(),
});

const registration = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const { error } = userSchema.validate({ email, password, subscription });
    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registration;
