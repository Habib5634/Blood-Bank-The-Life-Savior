const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, "role is required"],
            enum: ["admin", "organisation", "donor", "hospital"],
        },
        name: {
            type: String,
            required: function () {
                if (this.role === "user" || this.role === "admin") {
                    return true;
                }
                return false;
            },
        },
        organisationName: {
            type: String,
            required: function () {
                if (this.role === "organisation") {
                    return true;
                }
                return false;
            },
        },
        hospitalName: {
            type: String,
            required: function () {
                if (this.role === "hospital") {
                    return true;
                }
                return false;
            },
        },
        age: {
            type: Number,
            // required: [true, "Age is required"],
        },
        bloodGroup: {
            type: String,
            // required: [true, "blood group is require"],
            enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: {
                validator: function (value) {
                    // Password validation regex
                    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
                    return passwordRegex.test(value);
                },
                message: 'Password must be at least 8 characters long, include a capital letter, and contain numbers.',
            },
        },
        website: {
            type: String,
        },
        city: {
            type: String,
            required: [true, "city is required"],
            lowercase: true // This ensures that the city will be stored in lowercase
        },
        phone: {
            type: String,
            required: [true, "phone numbe is required"],
        },
        notification: {
            type: Array,
            default: []
        },
        bloodNotification: {
            type: Array,
            default: []
        },
        seenNotification: {
            type: Array,
            default: []
        },
    },
    { timestamps: true }
);

// Pre-save middleware to convert the city to lowercase
userSchema.pre('save', function (next) {
    if (this.isModified('city')) {
        this.city = this.city.toLowerCase();
    }
    next();
});


module.exports = mongoose.model("users", userSchema);
