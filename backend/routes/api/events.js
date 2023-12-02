const express = require("express");
const {
	Event,
	Event_Image,
	User,
	Venue,
	Attendance,
} = require("../../db/models");
const { validateEvent } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const attendance = require("../../db/models/attendance");
const router = express.Router();

//Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const eventId = req.params.eventId;

		let userMembership = false;
		//check if event exist AND grab groupId
		const event = await Event.findByPk(eventId);
		if (!event) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is member of group
		const isMember = await User.scope({
			method: ["isMember", user.id, event.groupId],
		}).findOne();
		if (isMember) {
			if (
				isMember["Memberships.status"] === "member" ||
				isMember["Memberships.status"] === "co-host"
			) {
				userMembership = true;
			}
		}

		//check to see if user is pending or already attending event
		const isGoing = await Attendance.findOne({
			where: {
				userId: user.id,
				eventId: eventId,
				status: ["pending", "attending", "waitlist"],
			},
		});
		if (isGoing) {
			if (isGoing.status === "pending" || isGoing.status === "waitlist") {
				const err = new Error("Attendance has already been requested");
				err.status = 400;
				return next(err);
			}
			if (isGoing.status === "attending") {
				const err = new Error("User is already an attendee of the event");
				err.status = 400;
				return next(err);
			}
		} else {
			if (userMembership) {
				const requestAttendance = await Attendance.create({
					userId: user.id,
					eventId: eventId,
					status: "pending",
				});

				return res.json({
					userId: requestAttendance.userId,
					status: requestAttendance.status,
				});
			} else {
				const err = new Error("Forbidden");
				err.status = 403;
				return next(err);
			}
		}
	} catch (err) {
		next(err);
	}
});

//Get all Attendees of an Event specified by its id
router.get("/:eventId/attendees", async (req, res, next) => {
	try {
		const { user } = req;
		const eventId = req.params.eventId;

		let scopeMethod = "allAttendees";

		//check if event exist AND grab groupId
		const event = await Event.findByPk(eventId);
		if (!event) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if a user is logged in
		if (user) {
			//check user roles
			const roles = await User.scope({
				method: ["isOrganizerOrCoHost", user.id, event.groupId],
			}).findOne();

			if (roles.Groups.length >= 1 || roles.Memberships.length >= 1) {
				scopeMethod = "allAttendeesAuthorized";
			}
		}

		const result = await User.scope({
			method: [scopeMethod, eventId],
		}).findAll();

		const attendees = Attendance.organizeAttendees(result);
		return res.json({ Attendees: attendees });
	} catch (err) {
		next(err);
	}
});

//Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const { url, preview } = req.body;
		const eventId = req.params.eventId;
		//Check to see if event exists
		const doesExist = await Event.findByPk(eventId);
		if (!doesExist) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is authorized
		const roles = await User.scope({
			method: ["isAttendeeOrCoHostOrHost", user.id, eventId],
		}).findOne();
		if (!roles) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		//add image to event
		const addImage = await Event_Image.create({ eventId, url, preview });
		return res.json({
			id: addImage.id,
			url: addImage.url,
			preview: addImage.preview,
		});
	} catch (err) {
		next(err);
	}
});

//Delete an Event specified by its id
router.delete("/:eventId", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const eventId = req.params.eventId;

		//check to see if event exists
		const checkEvent = await Event.findByPk(eventId);
		if (!checkEvent) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is group organizer or cohost
		const roles = await User.scope({
			method: ["isOrganizerOrCoHost", user.id, checkEvent.groupId],
		}).findOne();
		if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		//delete event
		await checkEvent.destroy();

		return res.json({
			message: "Successsfully deleted",
		});
	} catch (err) {
		next(err);
	}
});

//Edit an Event specified by its id
router.put("/:eventId", requireAuth, validateEvent, async (req, res, next) => {
	try {
		const { user } = req;
		const eventId = req.params.eventId;
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

		//check to see if event exists
		const checkEvent = await Event.findByPk(eventId);
		if (!checkEvent) {
			const err = new Error("Event couldn't be found");
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
			method: ["isOrganizerOrCoHost", user.id, checkEvent.groupId],
		}).findOne();
		if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		//update event
		const updatedEvent = await checkEvent.update({
			venueId,
			name,
			type,
			capacity,
			price,
			description,
			startDate,
			endDate,
		});

		//return the event that was just updated
		return res.json(await Event.findByPk(updatedEvent.id));
	} catch (err) {
		next(err);
	}
});

//Get details of an Event specified by its id
router.get("/:eventId", async (req, res, next) => {
	try {
		const eventId = req.params.eventId;
		//Check to see if event exists
		const doesExist = await Event.findByPk(eventId);
		if (!doesExist) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		const result = await Event.getEventById(eventId);

		res.json(result);
	} catch (err) {
		next(err);
	}
});

//Get all events
router.get("/", async (req, res, next) => {
	try {
		const events = await Event.getAllEvents();

		res.json({
			Events: events,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
