const User = require("../models/usersCollection");
const logger = require("winston");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            res.status(400).json({ message: "No Users Found...!!" });
        }
        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ message: "Error in fetching users from DB...!!", error });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required..!!"
            });
        }
        const user = await User.findOne({ email });
        res.status(200).json({ user });
    } catch (error) {
        logger.error({
            level: "error",
            message: "Error in fetching users from DB...!!"
        });
        res.status(400).json({ message: "Error in fetching users from DB...!!", error });
    }
}

exports.addNewUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;

        if (!name || !email || !phone || !role) {
            return res.status(400).json({ message: "All fields are necessary to add new user..!!" });
        }

        const existingUser = await User.findOne({ email: email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: "User already exists.." });
        }

        const newUser = await User.create({ name, email, phone, role });

        return res.status(200).json({ message: "User created into DB successfully..", newUser });

    } catch (error) {
        // console.log(error);
        logger.error({
            level: "error",
            message: "Error in creating new User in DB...!!"
        });
        res.status(400).json({ message: "Error in creating new User in DB...!!", error });
    }
};