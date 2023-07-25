const express = require("express");
const {
    registerController,
    loginController,
    currentUserController,
    applyBloodBankController,
    getAllNotificationController,
    deleteAllNotificationController,
    findBloodController,
    getBloodRequestController,
    respondRequestController,
} = require("../controller/authController");
const authMiddelware = require("../middleware/authMiddleware");
const { getAllBloodBankController } = require("../controller/adminController");

const router = express.Router();

//routes
//REGISTER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddelware, currentUserController);

//Apply doctor || POST
router.post("/apply-blood-bank", authMiddelware, applyBloodBankController)

//Apply doctor || POST
router.get("/get-blood-bank", authMiddelware, getAllBloodBankController)

//notification Blood Bank || POST
router.post("/get-all-notification", authMiddelware, getAllNotificationController)

//notification Doctor || POST
router.post("/delete-all-notification", authMiddelware, deleteAllNotificationController)

// Define the route for finding blood
router.post('/find-blood', authMiddelware, findBloodController);


// Define the route for getting blood request 
router.get('/get-blood-request', authMiddelware, getBloodRequestController);

// Define the route for finding blood
router.post('/respond-blood-request', authMiddelware, respondRequestController);

module.exports = router;
