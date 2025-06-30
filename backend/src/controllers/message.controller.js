import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId ,io} from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loogedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loogedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { idx: userToChatId } = req.params; //idx renamed to userToChatId for clarity
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
try{
    const {text, image} = req.body;
    const { id: receiverId } = req.params; //id renamed to receiverId for clarity
    const senderId = req.user._id;

    let imageUrl;
    if(image)
    {
        // upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image    
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Save the message to the database
    const savedMessage = await newMessage.save();

    
    //save the message and then in real time emit the message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId)
    {
        // Emit the message to the receiver's socket immediately if they are online
        io.to(receiverSocketId).emit("newMessage",savedMessage);//the newMessage event will be listened to by the receiver's socket
    }

    res.status(201).json(savedMessage);

}catch(error)
{
    console.error("Error in sendMessage Controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
}
};
