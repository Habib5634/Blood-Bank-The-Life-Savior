const userModel = require("../models/userModel");
const bloodBankModel = require('../models/bloodBankModel')
//GET DONAR LIST
const getDonorsListController = async (req, res) => {
    try {
        const donorData = await userModel
            .find({ role: "donor" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: donorData.length,
            message: "Donor List Fetched Successfully",
            donorData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In DOnor List API",
            error,
        });
    }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel
            .find({ role: "hospital" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: hospitalData.length,
            message: "HOSPITAL List Fetched Successfully",
            hospitalData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Hospital List API",
            error,
        });
    }
};
//GET ORG LIST
const getOrgListController = async (req, res) => {
    try {
        const orgData = await userModel
            .find({ role: "organisation" })
            .sort({ createdAt: -1 });

        return res.status(200).send({
            success: true,
            Toatlcount: orgData.length,
            message: "ORG List Fetched Successfully",
            orgData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG List API",
            error,
        });
    }
};
// =======================================

//DELETE DONAR
const deleteDonorController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: " Record Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting ",
            error,
        });
    }
};



//get blood banks
const getAllBloodBankController = async (req, res) => {
    try {
        const doctors = await bloodBankModel.find({})
        res.status(200).send({
            success: true,
            message: "Blod Bank List Data",
            data: doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting doctors data",
            error
        })
    }
}


///Change account status controller
// Change account status controller
const changeAccountStatusController = async (req, res) => {
    try {
        const { bloodBankId, status } = req.body;
        const bloodBank = await bloodBankModel.findByIdAndUpdate(bloodBankId, { status });
        const user = await userModel.findOne({ _id: bloodBank.userId });

        // Set user role based on status
        // Set user role and name fields based on status
        if (status === 'approved') {
            user.role = 'organisation';
            user.organisationName = user.name; // Store the current name as organisationName
            user.name = undefined; // Remove the value from the name field
        } else {
            user.role = 'donor'; // Or any other role you want to set for non-approved status
        }
        await user.save();

        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-updated',
            message: `Your doctor account request has ${status}`,
            onClickPath: '/notification',
        });

        res.status(200).send({
            success: true,
            message: "Account status updated",
            data: bloodBank,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while changing the account status",
            error,
        });
    }
};


//EXPORT
module.exports = {
    getDonorsListController,
    getHospitalListController,
    getOrgListController,
    deleteDonorController,
    getAllBloodBankController,
    changeAccountStatusController
};
