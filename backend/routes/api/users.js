const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require('express-validator');
const { validateSignup } = require('../../utils/validation');

const router = express.Router();



// Sign up a user
router.post("/", validateSignup, async (req, res) => {
	const { firstName, lastName, email, username, password  } = req.body;
	const hashedPassword = bcrypt.hashSync(password);
	const user = await User.create({ firstName, lastName, email, username, hashedPassword });

	const safeUser = {
		id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
		email: user.email,
		username: user.username,
	};

	await setTokenCookie(res, safeUser);

	return res.json({
		user: safeUser,
	});
});

module.exports = router;
