const express = require("express");
let router = express.Router();

const addShelterEndPoints = require("./shelter");
const addShelteredEndPoints = require("./sheltered");
const addMissionEndPoints = require("./mission");

router = addShelterEndPoints(router);
router = addShelteredEndPoints(router);
router = addMissionEndPoints(router);

module.exports = router;
