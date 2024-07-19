import { LoginSchema } from "../../utils/UservalidationSchema";
import { RegisterSchema } from "../../utils/UservalidationSchema";
const ValidateLogin = (req, res, next) => {
  try {
    const { error } = LoginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({
          Error: error,
          message: "Please Enter all feild to Login",
          status: false,
        });
    }
    next();
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
};
const ValidateRegister = (req, res, next) => {
  try {
    const { error } =RegisterSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({
          Error: error,
          message: "Please Enter all feilds to Register",
          status: false,
        });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ Error: error, message: "Internal server Error" });
  }
};
module.exports = {
  ValidateLogin: ValidateLogin,
  ValidateRegister: ValidateRegister,
};
