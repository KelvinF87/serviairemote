// utils/crud.js
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import sendNewPasswordEmail from './sendPassword.js';

export const handleCreate = (Model, req, res) => {
    const newData = { ...req.body, user: req.payload._id };
    Model.create(newData)
        .then(newItem => {
            res.status(201).json(newItem);
        })
        .catch(err => {
            console.error(`Error creating ${Model.modelName}:`, err);
            res.status(500).json({ message: `Error creating ${Model.modelName}`, error: err.message });
        });
};

export const handleGetAll = (Model, req, res, populateOptions = '') => {
    const isAdmin = req.payload.roles.includes("admin");
    let query = {};

    if (!isAdmin) {
        query = { user: req.query.user }; // Filter by user ID
    }

    const findQuery = Model.find(query);

    if (populateOptions) {
        findQuery.populate(populateOptions);
    }

    findQuery.then(items => {
        res.status(200).json(items);
    })
    .catch(err => {
        console.error(`Error retrieving ${Model.modelName}s:`, err);
        res.status(500).json({ message: `Error retrieving ${Model.modelName}s`, error: err.message });
    });
};

export const handleGetAllUserAdmin = (Model, req, res, populateOptions = '') => {
    const isAdmin = req.payload.roles.includes("admin");
    const query = isAdmin ? Model.find() : Model.find({ _id: req.payload._id });

    if (populateOptions) {
        query.populate(populateOptions);
    }

    query.then(items => {
        res.status(200).json(items);
    })
    .catch(err => {
        console.error(`Error retrieving ${Model.modelName}s:`, err);
        res.status(500).json({ message: `Error retrieving ${Model.modelName}s`, error: err.message });
    });
};

export const handleGetOne = (Model, req, res, populateOptions = '') => {
    Model.findById(req.params.id)
        .populate(populateOptions)
        .then(item => {
            if (!item) return res.status(404).json({ message: `${Model.modelName} not found` });

             // Check if the item belongs to the user or if the user is an admin
            if (Model.modelName !== 'User' && item.user && item.user.toString() !== req.payload._id && !req.payload.roles.includes("admin")) {
                return res.status(403).json({ message: "Forbidden: You can only access your own items or you need admin rights." });
            }

            if (Model.modelName === 'User' && !req.payload.roles.includes("admin") && req.params.id !== req.payload._id) {
                return res.status(403).json({ message: "Forbidden:  You can only access your own user data or you need admin rights." });
            }

            res.status(200).json(item);
        })
        .catch(err => {
            console.error(`Error retrieving ${Model.modelName}:`, err);
            res.status(500).json({ message: `Error retrieving ${Model.modelName}`, error: err.message });
        });
};

export const handleUpdate = async (Model, req, res) => {
    try {
        const itemId = req.params.id;

        const item = await Model.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: `${Model.modelName} not found` });
        }

        // Check if the item belongs to the user or if the user is an admin
        if (Model.modelName !== 'User' && item.user && item.user.toString() !== req.payload._id && !req.payload.roles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden: You can only update your own items or you need admin rights." });
        }

        if (Model.modelName === 'User' && !req.payload.roles.includes("admin") && itemId !== req.payload._id) {
            return res.status(403).json({ message: "Forbidden:  You can only update your own user profile or you need admin rights." });
        }

        let updateData = { ...req.body };

        if (Model.modelName === 'User' && req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                updateData.password = hashedPassword;
            } catch (hashError) {
                console.error("Error hashing password:", hashError);
                return res.status(500).json({ message: "Error hashing password", error: hashError.message });
            }
        }

        const updatedItem = await Model.findByIdAndUpdate(itemId, updateData, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(500).json({ message: `Failed to update ${Model.modelName}`, error: "Update failed." });
        }

        res.status(200).json(updatedItem);

    } catch (err) {
        console.error(`Error updating ${Model.modelName}:`, err);
        res.status(500).json({ message: `Error updating ${Model.modelName}`, error: err.message });
    }
};

export const handleResetPassword = async (req, res) => {
    console.log("handleResetPassword called!");
    const userId = req.params.id;
    console.log("userId:", userId);

    try {
        const newPassword = Math.random().toString(36).slice(-8);
        console.log("newPassword:", newPassword);

        const salt = await bcrypt.genSalt(10);
        console.log("salt:", salt);

        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log("hashedPassword:", hashedPassword);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, runValidators: true }
        );
        console.log("updatedUser:", updatedUser);

        if (!updatedUser) {
            console.log("User not found!");
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await sendNewPasswordEmail(updatedUser.email, newPassword);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res.status(500).json({ message: "Password reset, but failed to send email.", error: emailError.message });
        }

        res.status(200).json({ message: "Password reset successfully.  Email sent to user." });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

export const handleDelete = async (Model, req, res) => {
    try {
        const itemId = req.params.id;

        const item = await Model.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: `${Model.modelName} not found` });
        }

         // Check if the item belongs to the user or if the user is an admin
        if (Model.modelName !== 'User' && item.user && item.user.toString() !== req.payload._id && !req.payload.roles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own items or you need admin rights." });
        }

        if (Model.modelName === 'User' && !req.payload.roles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden: Only admins can delete users." });
        }

        await Model.findByIdAndDelete(itemId);
        res.status(204).send();

    } catch (err) {
        console.error(`Error deleting ${Model.modelName}:`, err);
        res.status(500).json({ message: `Error deleting ${Model.modelName}`, error: err.message });
    }
};