const mongoose = require("mongoose");

const inventurySchema = new mongoose.Schema(
    {
        inventuryType: {
            type: String,
            required: [true, "inventury type require"],
            enum: ["in", "out"],
        },
        bloodGroup: {
            type: String,
            required: [true, "blood group is require"],
            enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
        },
        quantity: {
            type: Number,
            required: [true, "blood quanity is require"],
        },
        email: {
            type: String,
            required: [true, "Donor Email is Required"],
        },
        organisation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "organisation is require"],
        },
        hospital: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: function () {
                return this.inventuryType === "out";
            },
        },
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: function () {
                return this.inventuryType === "in";
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inventury", inventurySchema);
