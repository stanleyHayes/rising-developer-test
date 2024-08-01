const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    phone_number: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Phone number is invalid");
            }
        }
    },
    diagnostic_level: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    current_level: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    first_message_timestamp: {
        type: Date,
        required: true,
        validate(value) {
            if (!validator.isISO8601(value)) {
                throw new Error("First message timestamp is invalid");
            }
        }
    },
    last_message_timestamp: {
        type: Date,
        required: true,
        validate(value) {
            if (!validator.isISO8601(value)) {
                throw new Error("First message timestamp is invalid");
            }
        }
    },
    message_ids: {
        type: [{
            type: String,
            unique: true
        }]
    }
});


const User = mongoose.model("User", userSchema);
module.exports = User;