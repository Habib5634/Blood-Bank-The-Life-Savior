const mongoose = require("mongoose")

const bloodBankSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    firstName: {
        type: String,
        required: [true, "First Name is Required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required"]
    },
    phone: {
        type: String,
        required: [true, "Phone no is Required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"]
    },
    address: {
        type: String,
        required: [true, "Address is Required"]
    },
    city: {
        type: String,
        required: [true, "City is Required"]
    },
    licienceNo: {
        type: String,
        required: [true, "Licience No is Required"]
    },
    storageCapacity: {
        type: Number,
        required: [true, "Storage Capacity is Required"]
    },
    status: {
        type: String,
        default: "pending"
    },
    startTime: {
        type: Object,
        required: [true, "Start timing is required"]
    },
    endTime: {
        type: Object,
        required: [true, "End timing is required"]
    }


}, { timestamps: true })
const bloodBankModel = mongoose.model("bloodBank", bloodBankSchema);
module.exports = bloodBankModel