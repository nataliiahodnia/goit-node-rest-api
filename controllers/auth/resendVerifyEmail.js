const { HttpError } = require("../../helpers/HttpError");
const { User } = require("../../models/user");
const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify your email</a>`,
    };

    await sendEmail(verifyEmail);
    res.json({
      email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = resendVerifyEmail;
