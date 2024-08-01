const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const validator = require("validator");

const User = require("user");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch(error => {
    console.log(`Unable to connect to MongoDB: ${error.message}`);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());


app.get("/:id", async (req, res) => {
    try {
        // retrieve the id parameter from the path
        const {id} = req.params;
        // query the database for the user with the given id
        // SELECT * FROM users WHERE id = ? - if it is using SQL
        const user = await User.findById(id);
        // if the user was not found, return a 404 error
        if (!user) {
            return res.status(404).json({
                error: `User with id ${id} not found`
            });
        }
        // return a success response with the user
        res.status(200).json({
            data: user
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
});

app.post('/', async (req, res) => {
    try {
        const {
            id,
            phone_number,
            diagnostic_level,
            current_level,
            email,
            name,
            first_message_timestamp,
            last_message_timestamp,
            message_ids
        } = req.body;

        // verify that all required fields are present
        if (!id || !phone_number || !diagnostic_level || !current_level || !first_message_timestamp || !last_message_timestamp || !message_ids) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }
        // check to see if first message timestamp is valid
        if(!validator.isISO8601(first_message_timestamp)) {
            return res.status(400).json({
                error: "First message timestamp should be ISO8601 format"
            });
        }

          // check to see if last message timestamp is valid
        if(!validator.isISO8601(last_message_timestamp)) {
            return res.status(400).json({
                error: "Last message timestamp should be ISO8601 format"
            });
        }

        // check to see if current level within the valid range
        if (current_level < 0 || current_level > 10) {
            return res.status(400).json({
                error: "Current level must be between 0 and 10"
            });
        }

        // check to see if diagnostic level within the valid range
        if (diagnostic_level < 0 || diagnostic_level > 10) {
            return res.status(400).json({
                error: "Diagnostic level must be between 0 and 10"
            });
        }

        // check to see if phone number is valid
        if (!validator.isPhoneNumber(phone_number)) {
            return res.status(400).json({
                error: `Invalid phone number: ${phone_number}`
            });
        }

        // check to see if email is valid when it is supplied since it is optional
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({
                message: `Invalid email: ${email}`
            });
        }

        // check if the user already exists with the given id
        const checkID = await User.findById(id);
        if (checkID) {
            return res.status(400).json({
                error: `User with id ${id} already exists`
            });
        }

        // I can destructure it into a set to remove all the duplicates and save the ids
        const uniqueIds = [...new Set(message_ids)];
        if (uniqueIds.length !== message_ids.length) {
            return res.status(400).json({
                error: "Message ids must be unique"
            });
        }

        // INSERT INTO user (id, phone_number, diagnostic_level, current_level, email, name, first_message_timestamp, last_message_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        // create user in database
        const user = await User.create({
            id,
            phone_number,
            diagnostic_level,
            current_level,
            email,
            name,
            first_message_timestamp,
            last_message_timestamp,
            message_ids
        });

        res.status(201).json({
            data: user
        });

    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Listening on port 3000");
});

// in terms of deployment, I would recommend using a cloud provider like Vercel, or Render