const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: [true, "city is required"],
            lowercase: true // This ensures that the city will be stored in lowercase
        },
        bloodGroup: {
            type: String,
            enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
            required: true,
        },
        status: {
            type: String,
            default: "pending"
        },
    },
    { timestamps: true }
);

// Pre-save middleware to convert the city to lowercase
bloodRequestSchema.pre('save', function (next) {
    if (this.isModified('city')) {
        this.city = this.city.toLowerCase();
    }
    next();
});

module.exports = mongoose.model('bloodRequests', bloodRequestSchema);