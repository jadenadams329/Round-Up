const express = require("express");
const { Event, Event_Image, User, Venue } = require("../../db/models");
const { validateEvent } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

//Add an Image to an Event based on the Event's id
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
	try {
		const { url, preview } = req.body;
		const eventId = req.params.eventId;
		//Check to see if event exists
		const doesExist = await Event.findByPk(eventId);
		if (!doesExist) {
			const err = new Error("Event couldn't be found");
			err.status = 404;
			return next(err);
		}

		/* TODO:
        figure out what the authorization means
         */

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
router.delete('/:eventId', requireAuth, async (req, res, next) => {
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
            message: 'Successsfully deleted'
        })

    } catch (err) {

    }
})

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
