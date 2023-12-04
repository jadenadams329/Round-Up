const express = require("express");
const { User, Event_Image, sequelize } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const imageId = req.params.imageId;

		//check to see if image exists
		const image = await Event_Image.findOne({
			where: {
				id: imageId,
			},
			include: [
				{
					model: sequelize.models.Event,
					attributes: ["groupId"],
				},
			],
		});
		if (!image) {
			const err = new Error("Event Image couldn't be found");
			err.status = 404;
			return next(err);
		}

		//check to see if user is group organizer or cohost
		const roles = await User.scope({
			method: ["isOrganizerOrCoHost", user.id, image.Event.groupId],
		}).findOne();
		if (roles.Groups.length === 0 && roles.Memberships.length === 0) {
			const err = new Error("Forbidden");
			err.status = 403;
			return next(err);
		}

		//delete image if exists and if user is authorized
		await image.destroy();

		return res.json({
			message: "Successsfully deleted",
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
