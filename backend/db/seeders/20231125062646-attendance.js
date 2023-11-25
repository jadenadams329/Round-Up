'use strict';
const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          eventId: 1,
          userId: 2,
          status: "attending"
        },
        {
          eventId: 2,
          userId: 3,
          status: "pending"
        },
        {
          eventId: 3,
          userId: 2,
          status: "waitlist"
        }
      ], { validate: true }
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        eventId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  }
};
