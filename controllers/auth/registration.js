const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const { User } = require("../../models/user");
const { HttpError } = require("../../helpers/HttpError");
const { sendEmail } = require("../../helpers/sendEmail");
const { BASE_URL } = process.env;

const registration = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const verificationToken = uuidv4();

    if (user) {
      throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registration;
