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

		const err = Error("Bad request");
		err.errors = errors;
		err.status = 400;
		err.title = "Bad request.";
		next(err);
	}
	next();
};

const validateMembershipUpdate = [
	check("status")
		.custom((value) => {
			if (value === 'pending') {
				throw new Error("Cannot change a membership status to pending");
			}
			return true;
		}),
	handleValidationErrors
]

const validateAttendanceUpdate = [
	check("status")
		.custom((value) => {
			if (value === 'pending') {
				throw new Error("Cannot change an attendance status to pending");
			}
			return true;
		}),
	handleValidationErrors
]

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
	// check("password")
	// 	.exists({ checkFalsy: true })
	// 	.isLength({ min: 6 })
	// 	.withMessage("Password must be 6 characters or more."),
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

const validateEvent = [
	check("name")
		.isLength({ min: 4 })
		.withMessage("Name must be at least 5 characters"),
	check("type")
		.isIn(["In person", "Online"])
		.withMessage("Type must be Online or In person"),
	check("capacity")
		.isInt()
		.withMessage("Capacity must be an integer"),
	check("price")
		.isFloat()
		.withMessage("Price is invalid")
		.custom((value) => {
			if(value < 0){
				throw new Error("Price is invalid")
			}
			return true
		}),
	check("description")
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Description is required"),
	check("startDate")
		.exists()
		.withMessage("Start date must be in the future")
		.custom((value) => {
			let date = new Date(value)
			if (date <= new Date()) {
				throw new Error("Start date must be in the future")
			}
			return true
		}),
	check("endDate")
		.exists()
		.withMessage("End date is less than start date")
		.custom((value, { req }) => {
			if (new Date(value) < new Date(req.body.startDate)){
				throw new Error("End date is less than start date");
			}
			return true
		}),
	handleValidationErrors
]

const validateQueryParams = [
	check("page")
		.optional({ checkFalsy: true })
		.isInt({min: 1})
		.withMessage("Page must be greater than or equal to 1"),
	check("size")
		.optional({ checkFalsy: true })
		.isInt({min: 1})
		.withMessage("Size must be greater than or equal to 1"),
	check("name")
		.optional({ checkFalsy: true })
		.isString()
		.withMessage("Name must be a string"),
	check("type")
		.optional({ checkFalsy: true })
		.isIn(["In person", "Online"])
		.withMessage("Type must be 'Online' or 'In Person'"),
	check("startDate")
		.optional({ checkFalsy: true })
		.isDate()
		.withMessage("Start date must be a valid datetime"),
	handleValidationErrors
]

module.exports = {
	handleValidationErrors,
	validateGroupBody,
	validateSignup,
	validateLogin,
	validateVenue,
	validateEvent,
	validateMembershipUpdate,
	validateAttendanceUpdate,
	validateQueryParams
};
