const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");
const {
    getBloodGroupDetailsController,
} = require("../controller/analyticController");

const router = express.Router();

//routes

//GET BLOOD DATA
router.get("/bloodGroups-data", authMiddelware, getBloodGroupDetailsController);

module.exports = router;
