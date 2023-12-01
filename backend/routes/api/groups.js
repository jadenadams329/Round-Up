const express = require("express");
const {
	validateGroupBody,
	validateVenue,
	validateEvent,
} = require("../../utils/validation");
const { Group, Group_Image, User, Venue, Event } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//GET all Groups joined or organized by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
	const { user } = req;
	try {
		const userGroups = await Group.getUserGroups(user.id);
		return res.json({ Groups: userGroups });
	} catch (err) {
		next(err);
	}
});

//Get all Members of a Group specified by its id
router.get("/:groupId/members", async (req, res, next) => {
	try {
		const { user } = req;
		const groupId = req.params.groupId;
		//check to see if group exists
		const group = await Group.findByPk(groupId);
		if (!group) {
			const err = new Error("Group couldn't be found");
			err.status = 404;
			return next(err);
		}

		let scopeMethod = "allMembers";
		//check to see if there is a user
		if (user) {
			//check if user is organizer or co-host
			const roles = await User.scope({
				method: ["isOrganizerOrCoHost", user.id, groupId],
			}).findOne();
			//if they are, change scope method
			if (roles.Groups.length >= 1 || roles.Memberships.length >= 1) {
				scopeMethod = "allMembersAuthorized";
			}
		}

		const members = await User.scope({
			method: [scopeMethod, groupId],
		}).findAll();

		const memberships = User.organizeMembers(members);

		res.json({
			Members: memberships,
		});
	} catch (err) {
		next(err);
	}
});

//Create an Event for a Group specified by its id
router.post(
	"/:groupId/events",
	requireAuth,
	validateEvent,
	async (req, res, next) => {
		try {
			const { user } = req;
			const groupId = req.params.groupId;
			const {
				venueId,
				name,
				type,
				capacity,
				price,
				description,
				startDate,
				endDate,
			} = req.body;

			//check to see if group exists
			const checkGroup = await Group.findByPk(groupId);
			if (!checkGroup) {
				const err = new Error("Group couldn't be found");
				err.status = 404;
				return next(err);
			}

			//check to see if venue exists
			if (venueId) {
				const checkVenue = await Venue.findByPk(venueId);
				if (!checkVenue) {
					const err = new Error("Venue couldn't be found");
					err.status = 404;
					return next(err);
				}
			}

			//check to see if user is group organizer or cohost
			const roles = await User.scope({
				method: ["isOrganizerOrCoHost", user.id, groupId],
			}).findOne();
			if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
				const err = new Error("Forbidden");
				err.status = 403;
				return next(err);
			}

			//create the event
			const newEvent = await Event.create({
				groupId: groupId,
				venueId,
				name,
				type,
				capacity,
				price,
				description,
				startDate,
				endDate,
			});

			return res.json(await Event.findByPk(newEvent.id));
		} catch (err) {
			next(err);
		}
	}
);

//Get Get all Events of a Group specified by its id
router.get("/:groupId/events", async (req, res, next) => {
	try {
		const groupId = req.params.groupId;
		//check to see if group exists
		const checkGroup = await Group.findByPk(groupId);
		if (!checkGroup) {
			const err = new Error("Group couldn't be found");
			err.status = 404;
			return next(err);
		}
		const events = await Event.getEventsByGroupId(groupId);

		return res.json({
			Events: events,
		});
	} catch (err) {
		next(err);
	}
});

//Get All Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const groupId = req.params.groupId;

		//check to see if group exists
		const checkGroup = await Group.findByPk(groupId);
		if (!checkGroup) {
			const err = new Error("Group couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is group organizer or cohost
		const roles = await User.scope({
			method: ["isOrganizerOrCoHost", user.id, groupId],
		}).findOne();
		if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		const venues = await Venue.findAll({
			where: { groupId: groupId },
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		return res.json({
			Venues: venues,
		});
	} catch (err) {
		next(err);
	}
});

//Create a new Venue for a Group specified by its id
router.post(
	"/:groupId/venues",
	requireAuth,
	validateVenue,
	async (req, res, next) => {
		try {
			const { user } = req;
			const groupId = req.params.groupId;
			const { address, city, state, lat, lng } = req.body;

			//check to see if group exists
			const checkGroup = await Group.findByPk(groupId);
			if (!checkGroup) {
				const err = new Error("Group couldn't be found");
				err.status = 404;
				return next(err);
			}

			//check to see if user is group organizer or cohost
			const roles = await User.scope({
				method: ["isOrganizerOrCoHost", user.id, groupId],
			}).findOne();
			if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
				const err = new Error("Forbidden");
				err.status = 403;
				return next(err);
			}

			const newVenue = await Venue.create({
				groupId: groupId,
				address,
				city,
				state,
				lat,
				lng,
			});

			return res.json(await Venue.findByPk(newVenue.id));
		} catch (err) {
			next(err);
		}
	}
);

//Add an Image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const { url, preview } = req.body;
		const groupId = req.params.groupId;

		//check to see if group exists
		const checkGroup = await Group.findByPk(groupId);
		if (!checkGroup) {
			const err = new Error("Group couldn't be found");
			err.status = 404;
			return next(err);
		}
		//check to see if user is group organizer
		const isAuthorized = await Group.scope({
			method: ["isGroupOrganizer", groupId, user.id],
		}).findOne();
		if (!isAuthorized) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}
		//add image to group
		const addImage = await Group_Image.create({ groupId, url, preview });
		return res.json({
			id: addImage.id,
			url: addImage.url,
			preview: addImage.preview,
		});
	} catch (err) {
		next(err);
	}
});

//GET details of a Group from an id
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

		return res.json(group);
	} catch (err) {
		next(err);
	}
});

//Delete group by ID
router.delete("/:groupId", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const groupId = req.params.groupId;

		//check to see if group exists
		const checkGroup = await Group.findByPk(groupId);
		if (!checkGroup) {
			const err = new Error("Group couldn't be found");
			err.status = 404;
			return next(err);
		}
		//check to see if user is group organizer
		const isAuthorized = await Group.scope({
			method: ["isGroupOrganizer", groupId, user.id],
		}).findOne();
		if (!isAuthorized) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		await checkGroup.destroy();

		return res.json({
			message: "Successfully deleted",
		});
	} catch (err) {
		next(err);
	}
});

//Edit a Group
router.put(
	"/:groupId",
	requireAuth,
	validateGroupBody,
	async (req, res, next) => {
		try {
			const { user } = req;
			const { name, about, type, private, city, state } = req.body;
			const groupId = req.params.groupId;

			//check to see if group exists
			const checkGroup = await Group.findByPk(groupId);
			if (!checkGroup) {
				const err = new Error("Group couldn't be found");
				err.status = 404;
				return next(err);
			}

			//check to see if user is group organizer
			const isAuthorized = await Group.scope({
				method: ["isGroupOrganizer", groupId, user.id],
			}).findOne();
			if (!isAuthorized) {
				const err = new Error("Forbidden");
				err.status = 403;
				return next(err);
			}

			const updatedGroup = await checkGroup.update({
				name,
				about,
				type,
				private,
				city,
				state,
			});

			return res.json(updatedGroup);
		} catch (err) {
			next(err);
		}
	}
);

//GET all Groups
router.get("/", async (req, res, next) => {
	try {
		const groups = await Group.getAllGroups();
		return res.json({ Groups: groups });
	} catch (err) {
		next(err);
	}
});

//Create a Group
router.post("/", requireAuth, validateGroupBody, async (req, res, next) => {
	try {
		const { user } = req;
		const { name, about, type, private, city, state } = req.body;
		const newGroup = await Group.create({
			organizerId: user.id,
			name,
			about,
			type,
			private,
			city,
			state,
		});
		res.status(201);
		return res.json(newGroup);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
