const express = require("express");
const { User, Venue } = require("../../db/models");
const { validateVenue } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

router.put("/:venueId", requireAuth, validateVenue, async (req, res, next) => {
	try {
		const { user } = req;
		const venueId = req.params.venueId;
		const { address, city, state, lat, lng } = req.body;

		//check to see if venue exists
		const checkVenue = await Venue.findByPk(venueId);
		if (!checkVenue) {
			const err = new Error("Venue couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is group organizer or cohost
		const roles = await User.scope({
			method: ["isOrganizerOrCoHost", user.id, checkVenue.groupId],
		}).findOne();
		if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		//update venue
		const updatedVenue = await checkVenue.update({
			address,
			city,
			state,
			lat,
			lng,
		});

		return res.json(await Venue.findByPk(updatedVenue.id));
	} catch (err) {
		next(err);
	}
});

module.exports = router;
