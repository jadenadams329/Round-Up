'use strict';
const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 3,
          groupId: 2,
          status: "member"
        },
        {
          userId: 3,
          groupId: 1,
          status: "pending"
        },
        {
          userId: 2,
          groupId: 1,
          status: "member"
        },
        {
          userId: 2,
          groupId: 3,
          status: "co-host"
        },
        {
          userId: 1,
          groupId: 2,
          status: "pending",
        },
        {
          userId: 1,
          groupId: 3,
          status: "pending"
        }
      ], { validate: true }
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  }
};
