const { User } = require("../../models/user");

const subscriptionUpdate = async (req, res, next) => {
  try {
    const { subscription: newValueSub } = req.body;
    const { email, _id } = req.user;

    const validSubscriptions = ["starter", "business", "pro"];

    if (!validSubscriptions.includes(newValueSub)) {
      return res
        .status(400)
        .json({ message: "This subscription does not exist" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { subscription: newValueSub },
      { new: true }
    );

    res.json({
      email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = subscriptionUpdate;