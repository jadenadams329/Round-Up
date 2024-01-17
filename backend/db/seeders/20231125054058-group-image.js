"use strict";
const { Group_Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		options.tableName = "Group_Images";
		options.validate = true;
		await Group_Image.bulkCreate(
			[
				{
					groupId: 1,
					url: "https://www.bmwusa.com/content/dam/bmwusa/common/vehicles/2023/my24/m-models/m3-sedan/overview/mobile/BMW-MY24-M3-Overview-M3CS-01-Mobile.jpg",
					preview: true,
				},
				{
					groupId: 2,
					url: "https://edgecast-img.yahoo.net/mysterio/api/994B7F277F7BF765FF140428F41CFF1FCADDBB1BAB48E079327FA1B0DE2E73BB/autoblog/resizefill_w1200_h720;quality_85;format_webp;cc_31536000;/https://o.aolcdn.com/images/dims3/GLOB/crop/1920x1080+0+96/resize/800x450!/format/jpg/quality/85/https://s.aolcdn.com/os/ab/_cms/2023/07/20101616/csm_ABT_RS7_LE_Legacy-Edition_3_4-Front_d81dd830d5.jpg",
					preview: true,
				},
				{
					groupId: 3,
					url: "https://wildearth.com/static/74e30e47c38d130a514f190c58a09120/9a6d1/black-german-shepherd-new-size.png",
					preview: true,
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Group_Images";
		return await queryInterface.bulkDelete(
			options,
			{
				preview: { [Op.in]: [true, false] },
			},
			{}
		);
	},
};
