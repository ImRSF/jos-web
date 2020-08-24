const { body } = require("express-validator");
const User = require("../models/user");

exports.login = [
  body("username").custom(async (val, { req }) => {
    // console.log(await User.loginUser(req.body.username, req.body.password))
    const account = await User.loginUser(req.body.username, req.body.password)
    if (account) {
      if (account.isPresent) {
        if (!account.isActive) {
          throw new Error("Account currently deactivated. Contact SU for assistance.");
        } else {
          return true;
        }
      } else {
        throw new Error("Account not found. Please try again.");
      }
    } else {
      throw new Error("Account not found. Please try again.");
    }
    // if (!(await User.loginUser(req.body.username, req.body.password))) {
    //   throw new Error("Account not found. Please try again.");
    // }
  })
];

exports.addAccount = [
  body("employeeNo")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("EmployeeNo", req.body.employeeNo);
      if (getUser.length == 0) {
        return true;
      } else {
        throw new Error(
          "Employee account already exists. Please select a different employee."
        );
      }
    }),
  body("email")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("PersonnelEmail", req.body.email);
      if (getUser.length != 0) {
        throw new Error("Email already used. Please enter a different email.");
      } else {
        return true;
      }
    }),
  body("username")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("Username", val);
      if (getUser.length != 0) {
        throw new Error(
          "Username already used. Please enter a different username."
        );
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .isLength({ min: 5 })
    .withMessage("Password length must contain more than 5 characters.")
    .matches("^(?=.*[a-zA-Z])(?=.*[0-9])")
    .withMessage("Password must contain letters and numbers!")
];

exports.editAccount = [
  body("employeeNo")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("PersonnelID", req.body.personnelId);
      if (getUser[0].EmployeeNo !== val) {
        const verifyValue = await User.getUser("EmployeeNo", val);
        if (verifyValue.length != 0) {
          throw new Error("Employee account already exists. Please select a different employee.");
        }
      } else {
        return true;
      }
    }),
  body("email")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("PersonnelID", req.body.personnelId);
      if (getUser[0].PersonnelEmail !== val) {
        const verifyValue = await User.getUser("PersonnelEmail", val);
        if (verifyValue.length != 0) {
          throw new Error("Email is already used! Please enter a different email");
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  body("username")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("PersonnelID", req.body.personnelId);
      if (getUser[0].Username !== val) {
        const verifyValue = await User.getUser("Username", val);
        if (verifyValue.length != 0) {
          throw new Error("Username is already used! Please enter a different username");
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .isLength({ min: 5 })
    .withMessage("Password length must contain more than 5 characters.")
    .matches("^(?=.*[a-zA-Z])(?=.*[0-9])")
    .withMessage("Password must contain letters and numbers")
];

exports.forgotPassword = [
  body("emailForPasswordReset")
    .not()
    .isEmpty()
    .withMessage("Please provide this field.")
    .custom(async (val, { req }) => {
      const getEmail = await User.getUser(
        "PersonnelEmail",
        req.body.emailForPasswordReset
      );
      if (!getEmail.length) {
        throw new Error(
          "Email not found in the database. Please enter a valid email."
        );
      }
      return true;
    })
];

exports.resetPassword = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom(async (val, { req }) => {
      const getUser = await User.getUser("Username", val);
      if (getUser.length != 0) {
        throw new Error(
          "Username already used. Please enter a different username."
        );
      }
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .isLength({ min: 5 })
    .withMessage("Password length must contain more than 5 characters.")
    // Password checker validator. Checks if the password has letters and numbers
    .matches("^(?=.*[a-zA-Z])(?=.*[0-9])")
    .withMessage("Password must contain letters and numbers"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("This field is required.")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password and confirm password does not match!");
      }
      return true;
    })
];
