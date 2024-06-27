const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { mongooseError } = require("../middlewares/mongooseError");

const validationEmail =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: validationEmail,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseError);

const regisSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(validationEmail).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const authSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(validationEmail).required(),
});

const schemas = {
  regisSchema,
  authSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};