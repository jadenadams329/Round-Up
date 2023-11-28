const { validationResult } = require("express-validator");
const { check } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		const errors = {};
		validationErrors
			.array()
			.forEach((error) => (errors[error.path] = error.msg));

		const err = Error("Bad request.");
		err.errors = errors;
		err.status = 400;
		err.title = "Bad request.";
		next(err);
	}
	next();
};

const validateGroupBody = [
	check("name")
		.isLength({ min: 1, max: 60 })
		.withMessage("Name must be 60 characters or less"),
	check("about")
		.isLength({ min: 50 })
		.withMessage("About must be 50 characters or more"),
	check("type")
		.isIn(["In person", "Online"])
		.withMessage("Type must be 'Online' or 'In person'"),
	check("private")
		.isBoolean({ checkFalsy: true })
		.withMessage("Private must be a boolean"),
	check("city")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("City is required"),
	check("state")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("State is required"),
	handleValidationErrors,
];

const validateSignup = [
	check("firstName")
		.exists({ checkFalsy: true })
		.isLength({ min: 1 })
		.withMessage("First Name is required"),
	check("lastName")
		.exists({ checkFalsy: true })
		.isLength({ min: 1 })
		.withMessage("Last Name is required"),
	check("email")
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage("Invalid email"),
	check("username")
		.exists({ checkFalsy: true })
		.isLength({ min: 4 })
		.withMessage("Username is required"),
	check("username").not().isEmail().withMessage("Username cannot be an email."),
	check("password")
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage("Password must be 6 characters or more."),
	handleValidationErrors,
];

const validateLogin = [
	check("credential")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Email or username is required"),
	check("password")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Password is required"),
	handleValidationErrors,
];

const validateVenue = [
	check("address")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Street address is required"),
	check("city")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("City is required"),
	check("state")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("State is required"),
	check("lat")
		.isFloat({ min: -90, max: 90 })
		.withMessage("Latitude must be within -90 and 90"),
	check("lng")
		.isFloat({ min: -180, max: 180 })
		.withMessage("Longitude must be within -180 and 180"),
	handleValidationErrors,
];

module.exports = {
	handleValidationErrors,
	validateGroupBody,
	validateSignup,
	validateLogin,
  validateVenue
};
