import mongoose from "mongoose";
import Message from "../models/messages.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid sender ID", success: false });
        }

        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver ID", success: false });
        }

        if (!text) {
            return res.status(400).json({ message: "Message text is required", success: false });
        }

        let imageUrl = null;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (error) {
                return res.status(500).json({
                    message: "Error uploading image",
                    success: false,
                    error: error.message
                });
            }
        }

        const newMessage = new Message({
            sender: mongoose.Types.ObjectId(senderId),
            receiver: mongoose.Types.ObjectId(receiverId),
            text,
            image: imageUrl
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message sent successfully",
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const myId = req.user._id;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID",
                success: false,
                data: myId
            });
        }

        if (!mongoose.Types.ObjectId.isValid(myId)) {
            return res.status(400).json({
                message: "Invalid sender ID",
                success: false
            });
        }

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: id },
                { sender: id, receiver: myId }
            ]
        }).sort("-createdAt");

        res.status(200).json({
            message: "Messages fetched successfully",
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching messages",
            success: false,
            error: error.message
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({
                message: "Invalid message ID",
                success: false
            });
        }

        const deletedMessage = await Message.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({
                message: "Message not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Message deleted successfully",
            success: true,
            data: deletedMessage
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting message",
            success: false,
            error: error.message
        });
    }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const myId = req.user._id;

        console.log(req.user)
        console.log("req.userrrr")

        if (!mongoose.Types.ObjectId.isValid(myId)) {
            return res.status(400).json({
                message: "Invalid user ID ",
                success: false,
                data: myId
            });
        }

        const users = await User.find({ _id: { $ne: myId } }).select("-password");

        res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            success: false,
            error: error.message
        });
    }
};
