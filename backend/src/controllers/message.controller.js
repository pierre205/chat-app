import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// Fetch all users except current user
export const getusersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password"); // not equal to loggedUserId
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getusersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};

// Fetch all messages between current user and userToChatId
export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }) // find all messages between both of us
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};

// Send a message to userToChatId
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        } // check if user upload image

        const nexMessage = new Message ({
            senderId,
            receiverId,
            text,
            image: imageUrl
        }); // create message 

        await nexMessage.save(); //save message in DB 

        // todo: realtime functionnality hoes here => socker.io

        res.status(200).json(nexMessage);
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};