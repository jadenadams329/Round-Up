const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Group } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const groups = await Group.getAllGroups();
		return res.json({ Groups: groups });
	} catch (err) {
		next(err);
	}
});

router.post('/', requireAuth, async (req, res, next) => {
    
})

router.get("/current", requireAuth, async (req, res, next) => {
	const { user } = req;
	try {
		const userGroups = await Group.getUserGroups(user.id);
		return res.json({ Groups: userGroups });
	} catch (err) {
		next(err);
	}
});

router.get("/:groupId", async (req, res, next) => {
	const groupId = req.params.groupId;
	try {
		const group = await Group.getGroupById(groupId);

		if (!group) {
			const err = new Error("Group couldn't be found");
			err.title = "Not Found";
			err.status = 404;
			return next(err);
		}

		res.json(group);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
