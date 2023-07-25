const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bloodBankModel = require("../models/bloodBankModel");
const bloodRequestModel = require("../models/bloodRequestModel");

//Register Controller
const registerController = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({ email: req.body.email });
        //validation
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "User ALready exists",
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        //rest data
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: "User Registerd Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error,
        });
    }
};


//login Controller
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials",
            });
        }
        //check role
        if (user.role !== req.body.role) {
            return res.status(500).send({
                success: false,
                message: "role dosent match",
            });
        }
        //compare password
        const comparePassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!comparePassword) {
            return res.status(500).send({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Login API",
            error,
        });
    }
};

//GET CURRENT USER controller   
const currentUserController = async (req, res) => {
    try {
        // Retrieve the user ID from the request headers or authentication token
        const userId = req.body.userId;

        // Find the user based on the retrieved user ID
        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "User Fetched Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Unable to get current user",
            error,
        });
    }
};


// Apply Blood Bank registration 
///Apply doctor controller
const applyBloodBankController = async (req, res) => {
    try {
        const newBloodBank = await bloodBankModel({ ...req.body, status: 'pending' })
        await newBloodBank.save()
        //find admin to recieve request
        const adminUser = await userModel.findOne({ role: "admin" })
        const notification = adminUser.notification
        notification.push({
            type: "apply-for-blood-bank-request",
            message: `${newBloodBank.firstName} ${newBloodBank.lastName} Has apply for a blood bank account`,
            data: {
                doctorId: newBloodBank._id,
                name: newBloodBank.firstName + " " + newBloodBank.lastName,
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "Doctor account apply successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while apply for doctor",
            error
        })
    }
}

// get all notificaton
const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updateUser = await user.save()
        console.log(user.seenNotification)
        console.log(user.notification)
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updateUser,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting notification",
            error
        })
    }
}


// delete all notification
const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = [];
        user.seennotification = [];
        const updateUser = await user.save()
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Notification deleted successfully",
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "unable to delete all notification",
            error,
        })
    }
}



// get All Blood banks 
///Get all doctor controller
const getAllBloodBankController = async (req, res) => {
    try {
        const bloodBank = await bloodBankModel.find({ status: "approved" }) //mtlb k agr docctor ka status approved hy tabhi doctor show kray
        res.status(200).send({
            success: true,
            message: "Successfully getting all blood Banks",
            data: bloodBank
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "Error while getting blood banks",
            error,
        })
    }
}

const findBloodController = async (req, res) => {
    try {
        const { userId, quantity, city, bloodGroup } = req.body;

        // Check if the user has already sent a request
        // const existingRequest = await bloodRequestModel.findOne({ user: userId, status: 'pending' });
        // if (existingRequest) {
        //     return res.status(400).json({ success: false, message: 'You have already sent a blood request. Please wait for the previous request to be resolved.' });
        // }

        // Find users with matching city and blood group
        const matchingUsers = await userModel.find({
            role: 'donor',
            city: city,
            bloodGroup: bloodGroup,
        });

        // Create and save the blood request
        const bloodRequest = new bloodRequestModel({
            user: userId,
            quantity,
            city,
            bloodGroup,
        });

        await bloodRequest.save();

        // Notify matching users
        const notificationMessage = `A blood request has been sent by a user in your city (${city}) with the blood group (${bloodGroup}).`;
        for (const user of matchingUsers) {
            user.bloodNotification.push({
                type: 'blood-request',
                message: notificationMessage,
                onClickPath: '/notification',
            });
            await user.save();
        }

        res.status(201).json({ success: true, message: 'Blood request sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while sending the blood request' });
    }
}


const getBloodRequestController = async (req, res) => {
    try {
        // Find all blood requests
        const bloodRequests = await bloodRequestModel.find().populate('user', 'name bloodGroup city');

        if (bloodRequests.length === 0) {
            return res.status(404).json({ success: false, message: 'No blood requests found.' });
        }

        res.status(200).json({ success: true, data: bloodRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while fetching blood requests' });
    }
}



//respond request controller
const respondRequestController = async (req, res) => {
    try {
        const { bloodRequestId, status } = req.body;

        // Validate the bloodRequestId
        if (!bloodRequestId) {
            return res.status(400).json({ success: false, message: 'Invalid request ID' });
        }

        // Update the blood request status to 'approved'
        const bloodRequest = await bloodRequestModel.findByIdAndUpdate(
            bloodRequestId,
            { status: 'approved' },
            { new: true }
        ).populate('user', 'name email');



        // Notify the user about the blood request response
        const bloodNotification = {
            type: 'blood-request-response',
            message: `Your blood request has been approved by .`,
            onClickPath: '/notification',
        };
        const user = await userModel.findByIdAndUpdate(bloodRequest.user._id, {
            $push: { bloodNotification },
        });

        return res.status(200).json({ success: true, message: 'Blood request response saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error while responding to the blood request' });
    }
};
// const respondRequestController = async (req, res) => {
//     try {
//         const { bloodRequestId, status } = req.body;
//         const bloodRequest = await bloodRequestModel.findByIdAndUpdate(
//             bloodRequestId,
//             { status },
//             { new: true }
//         ).populate('user', 'name email');

//         if (status === 'accepted') {
//             const bloodNotification = {
//                 type: 'blood-request-accepted',
//                 message: `Your blood request has been accepted.`,
//                 onClickPath: '/notification',
//             };
//             const user = await userModel.findByIdAndUpdate(bloodRequest.user._id, {
//                 $push: { bloodNotification },
//             });
//         }

//         res.status(200).json({ success: true, message: 'Blood request response saved' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error while responding to the blood request' });
//     }
// }











module.exports = {
    registerController,
    loginController,
    currentUserController,
    applyBloodBankController,
    getAllNotificationController, deleteAllNotificationController,
    getAllBloodBankController, findBloodController,
    getBloodRequestController, respondRequestController
};



// const currentUserController = async (req, res) => {
//     try {
//         const user = await userModel.findOne({ _id: req.body.userId });
//         console.log(user)
//         return res.status(200).send({
//             success: true,
//             message: "User Fetched Successfully",
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "unable to get current user",
//             error,
//         });
//     }
// };