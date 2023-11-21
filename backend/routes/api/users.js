const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
	check('firstName')
		.exists({ checkFalsy: true })
		.isLength({ min: 1 })
		.withMessage("First Name is required"),
	check('lastName')
		.exists({ checkFalsy: true })
		.isLength({ min: 1 })
		.withMessage("Last Name is required"),
	check('email')
	  .exists({ checkFalsy: true })
	  .isEmail()
	  .withMessage('Please provide a valid email.'),
	check('userName')
	  .exists({ checkFalsy: true })
	  .isLength({ min: 4 })
	  .withMessage('Please provide a username with at least 4 characters.'),
	check('userName')
	  .not()
	  .isEmail()
	  .withMessage('Username cannot be an email.'),
	check('password')
	  .exists({ checkFalsy: true })
	  .isLength({ min: 6 })
	  .withMessage('Password must be 6 characters or more.'),
	handleValidationErrors
  ];

// Sign up a user
router.post("/", validateSignup, async (req, res) => {
	const { firstName, lastName, email, userName, password  } = req.body;
	const hashedPassword = bcrypt.hashSync(password);
	const user = await User.create({ firstName, lastName, email, userName, hashedPassword });

	const safeUser = {
		id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
		email: user.email,
		userName: user.userName,
	};

	await setTokenCookie(res, safeUser);

	return res.json({
		user: safeUser,
	});
});

module.exports = router;
