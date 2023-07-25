const mongoose = require("mongoose");
const inventuryModel = require("../models/inventuryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventuryController = async (req, res) => {
    try {
        const { email } = req.body;
        //validation
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }
        // if (inventuryType === "in" && user.role !== "donar") {
        //   throw new Error("Not a donar account");
        // }
        // if (inventuryType === "out" && user.role !== "hospital") {
        //   throw new Error("Not a hospital");
        // }

        if (req.body.inventuryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //calculate Blood Quanitity
            const totalInOfRequestedBlood = await inventuryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventuryType: "in",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventuryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventuryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //quantity validation
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donor = user?._id;
        }

        //save record
        const inventury = new inventuryModel(req.body);
        await inventury.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Reocrd Added",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Errro In Create Inventury API",
            error,
        });
    }
};

// GET ALL BLOOD RECORS
const getInventuryController = async (req, res) => {
    try {
        const inventury = await inventuryModel
            .find({
                organisation: req.body.userId,
            })
            .populate("donor")
            .populate("hospital")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            messaage: "get all records successfully",
            inventury,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get All Inventury",
            error,
        });
    }
};
// GET Hospital BLOOD RECORS
const getInventuryHospitalController = async (req, res) => {
    try {
        const inventury = await inventuryModel
            .find(req.body.filters)
            .populate("donor")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            messaage: "get hospital comsumer records successfully",
            inventury,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get consumer Inventury",
            error,
        });
    }
};

// GET BLOOD RECORD OF 3
const getRecentInventuryController = async (req, res) => {
    try {
        const inventury = await inventuryModel
            .find({
                organisation: req.body.userId,
            })
            .limit(3)
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "recent Invenotry Data",
            inventury,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Recent Inventury API",
            error,
        });
    }
};

// GET DONAR REOCRDS
const getDonorsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find donors
        const donorId = await inventuryModel.distinct("donor", {
            organisation,
        });
        // console.log(donorId);
        const donors = await userModel.find({ _id: { $in: donorId } });

        return res.status(200).send({
            success: true,
            message: "Donor Record Fetched Successfully",
            donors,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Donor records",
            error,
        });
    }
};

const getHospitalController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //GET HOSPITAL ID
        const hospitalId = await inventuryModel.distinct("hospital", {
            organisation,
        });
        //FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId },
        });
        console.log(hospitals)
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In get Hospital API",
            error,
        });
    }
};

// GET ORG PROFILES
const getOrgnaisationController = async (req, res) => {
    try {
        const donor = req.body.userId;
        const orgId = await inventuryModel.distinct("organisation", { donor });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG API",
            error,
        });
    }
};
// GET ORG for Hospital
const getOrgnaisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventuryModel.distinct("organisation", { hospital });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospital Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Hospital ORG API",
            error,
        });
    }
};

module.exports = {
    createInventuryController,
    getInventuryController,
    getDonorsController,
    getHospitalController,
    getOrgnaisationController,
    getOrgnaisationForHospitalController,
    getInventuryHospitalController,
    getRecentInventuryController,
};
