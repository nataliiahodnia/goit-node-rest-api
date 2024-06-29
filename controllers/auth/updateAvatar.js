const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");

const { User } = require("../../models/user");
const { HttpError } = require("../../helpers/HttpError");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw next(HttpError(400, "File not found"));
    }

    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);

    const image = await jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(resultUpload);

    await fs.unlink(tempUpload);
    const avatarURL = path.join("avatars", fileName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;