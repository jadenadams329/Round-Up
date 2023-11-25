'use strict';
const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "BMW Owners",
          about: "Group for BMW owners",
          type: "In person",
          private: true,
          city: "San Diego",
          state: "CA"
        },
        {
          organizerId: 2,
          name: "Audi Owners",
          about: "Group for Audi owners",
          type: "In person",
          private: false,
          city: "San Diego",
          state: "CA"
        },
        {
          organizerId: 3,
          name: "German Shepherd Dogs",
          about: "Group for all things German Shepherds",
          type: "In person",
          private: true,
          city: "San Diego",
          state: "CA"
        }
      ], { validate: true }
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["BMW Owners", "Audi Owners", "German Shepherd Dogs"] },
      },
      {}
    );
  }
};
