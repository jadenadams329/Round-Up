const express = require("express");
const { Event } = require("../../db/models");
const { validateVenue } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();
//get all events
router.get("/", async (req, res, next) => {
	try {
        const events = await Event.getAllEvents()

        res.json({
            Events: events
        })
	} catch (err) {
		next(err);
	}
});

module.exports = router;
