const express = require("express");
const authMiddelware = require("../middleware/authMiddleware");
const {
    getDonorsListController,
    getHospitalListController,
    getOrgListController,
    deleteDonorController,
    getAllBloodBankController,
    changeAccountStatusController,
} = require("../controller/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || DONAR LIST
router.get(
    "/donor-list",
    authMiddelware,
    adminMiddleware,
    getDonorsListController
);
//GET || HOSPITAL LIST
router.get(
    "/hospital-list",
    authMiddelware,
    adminMiddleware,
    getHospitalListController
);
//GET || ORG LIST
router.get("/org-list", authMiddelware, adminMiddleware, getOrgListController);
// ==========================

// DELETE DONAR || GET
router.delete(
    "/delete-donor/:id",
    authMiddelware,
    adminMiddleware,
    deleteDonorController
);


/// get method || doctors'
router.get("/getAllBloodBank", authMiddelware, getAllBloodBankController)
//POST account status
router.post('/changeAccountStatus', authMiddelware, changeAccountStatusController)

//EXPORT
module.exports = router;
