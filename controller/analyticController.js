const inventuryModel = require("../models/inventuryModel")
const mongoose = require('mongoose')
// Get Blood Data
const getBloodGroupDetailsController = async (req, res) => {
    try {
        const bloodGroups = ['O+', "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
        const bloodGroupData = [];
        const organisation = new mongoose.Types.ObjectId(req.body.userId);

        await Promise.all(bloodGroups.map(async (bloodGroup) => {
            const totalIn = await inventuryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventuryType: 'in',
                        organisation: organisation
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ]);

            const totalOut = await inventuryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventuryType: 'out',
                        organisation: organisation
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' }
                    }
                }
            ]);

            const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

            bloodGroupData.push({
                bloodGroup,
                totalIn: totalIn[0]?.total || 0,
                totalOut: totalOut[0]?.total || 0,
                availableBlood
            });
        }));

        return res.status(200).send({
            success: true,
            message: "Successfully fetched blood data",
            bloodGroupData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in bloodGroup data analytics API",
            error
        });
    }
};

module.exports = { getBloodGroupDetailsController }