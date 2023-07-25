const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");
const {
    createInventuryController,
    getInventuryController,
    getDonorsController,
    getHospitalController,
    getOrgnaisationController,
    getOrgnaisationForHospitalController,
    getInventuryHospitalController,
    getRecentInventuryController,
} = require("../controller/inventuryController");

const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventury", authMiddelware, createInventuryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventury", authMiddelware, getInventuryController);
//GET RECENT BLOOD RECORDS
router.get(
    "/get-recent-inventury",
    authMiddelware,
    getRecentInventuryController
);

//GET HOSPITAL BLOOD RECORDS
router.post(
    "/get-inventury-hospital",
    authMiddelware,
    getInventuryHospitalController
);

//GET DONAR RECORDS
router.get("/get-donors", authMiddelware, getDonorsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddelware, getHospitalController);

//GET orgnaisation RECORDS
router.get("/get-orgnaisation", authMiddelware, getOrgnaisationController);

//GET orgnaisation RECORDS
router.get(
    "/get-organisation-for-hospital",
    authMiddelware,
    getOrgnaisationForHospitalController
);

module.exports = router;
