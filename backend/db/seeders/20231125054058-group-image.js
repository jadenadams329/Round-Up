'use strict';
const { Group_Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Group_Image.bulkCreate(
      [
        {
          groupId: 1,
          url: null,
          preview: true
        },
        {
          groupId: 2,
          url: null,
          preview: false
        },
        {
          groupId: 3,
          url: null,
          preview: true
        }
      ], { validate: true }
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Group_Images";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  }
};
