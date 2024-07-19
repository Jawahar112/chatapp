import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GroupChat } from "../Models/Groupmodel.js";
import privateChat from "../Models/Messagemodel.js";
import { v4 as uuidv4 } from "uuid";
import usermodel from "../Models/usermodel.js";
import { onlineusers } from "../utils/users.js";


export const Register = async (req, res) => {
  const { Email, Password, Username } = req.body;
  if (!Email || !Password || !Username) {
    return res
      .status(400)
      .json({ Message: "please Enter All values", status: false });
  }
  try {
    const hashedPassword = await bcrypt.hash(Password, 8);
    const newUser = new Usermodel({
      Email,
      Password: hashedPassword,
      Username,
    });
    const saveduser = await newUser.save();

    if (!saveduser) {
      return res.json({
        Error: err,
        status: false,
        message: "User register was unsucessful",
      });
    }

    return res.status(200).json({
      data: data,
      message: "User registered SucessFully",
      Status: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ Error: error, message: "Internal server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const data = await usermodel.findOne({ Email });
    const isvalidpassword = await bcrypt.compare(Password, data.Password);
    if (data == null) {
      return res.json({ message: "Email is not registered", status: false });
    }

    if (!isvalidpassword) {
      return res.json({ message: "password does not match", status: false });
    }

    jsonwebtoken.sign(
      { userId: data._id },
      process.env.SECRET_KEY,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        return res.json(token);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Function to send a message
export const sendMessage = async (data, socket) => {
  try {
    const sender = socket.decoded.userId;
    const { receiver, message } = data;
     
    // Check if a chat already exists between sender and receiver
    let chatExist = await privateChat.findOne({
      $and: [
        { "participants.user": sender },
        { "participants.user": receiver },
      ]
    });

    if (!chatExist) {
      // If chat doesn't exist, create a new private chat

      const newChat = new privateChat({
        participants: [{ user: sender }, { user: receiver }],
        messages: [{ sender: sender, receiver: receiver, content: message }],
        roomid: uuidv4(),
      });

      const createdChat = await newChat.save();

      if (!createdChat) {
        throw new Error("Not Created!");
      }
    } else {
        const Isseen=await onlineusers()
      // If chat exists, update the existing chat with new message
      const updateddata=await privateChat.updateOne(
        { "participants.user": sender, "participants.user": receiver },
        {
          $push: {
            messages: {
              sender: sender,
              receiver: receiver,
              content: message,
             Isseen:Isseen
              
            },
          }
        }
      );
      if(!updateddata){
        throw new Error({Message:"Updation falied",status:false})
      }
      const roomid = chatExist.roomid;

      if (socket.rooms.has(roomid)) {
        socket.to(roomid).emit("messagesent", message);
      } else {
        return
      }
    }

    // Emit message sent event to both sender and receiver
  } catch (error) {
    console.error("Error sending message:", error);
  }
};



export const getmessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { chatId, receiver } = req.body;
  const privateChat=  privateschema
      .findById({ _id: chatId })
      .sort({ "messages.timestamp": -1 })
     
        if (!privateChat) {
          // Handle case where chat with given ID is not found
          throw new Error({Error:"Private chat not found"});
        }

        // Filter messages where the user is either sender or receiver
        const messages = privateChat.messages.filter(
          (
            message //filtering messages array for retreving current user's sent messages
          ) => message.sender.equals(sender)
        );
        const Receivermessages = privateChat.messages.filter(
          (
            message //filtering messages array for retreving second user's sent messages
          ) => message.sender.equals(receiver)
        );
    
        return res
          .status(200)
          .json({
            message: "Data fetched sucessfully",
            status: true,
            messages: messages,
            Receivermessages:Receivermessages
         
      })

     
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", Error: error });
  }
};



export const groupMessage = async (req, res) => {
  try {
    const currentuser = req.UserId;

    const { chatId } = req.params;

    const { message } = req.body;

    const Groupchat = await GroupChat.findOne({
      _id: chatId,
      "participants.user": currentuser,
    });
    if (!Groupchat) {
      return res.json({ Message: "No such a group Exist", status: false });
    }
    if (Groupchat) {
      const updatedchat = await GroupChat.updateOne(
        { _id: chatId, "participants.user": currentuser },
        { $push: { messages: { sender: currentuser, content: message } } }
      );
      if (updatedchat.modifiedCount == 1) {
        return res.status(200).json({
          Message: "message sent to group sucessfuly",
          status: true,
        });
      }
      return res.json({ Message: "message could not be sent", status: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ Error: error, message: "Internal server Error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const currentuser = req.UserId;
    const { users, GroupName } = req.body;
    const usersArray = [...users, { user: currentuser }]; //Including current user with added users

    const newGroup = new GroupChat({
      participants: usersArray,
      GroupName: GroupName,
    });
    await newGroup.save();
    return res
      .status(200)
      .json({ message: "Group created Sucssfully", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ Error: error.message, message: "Internal server Error" });
  }
};
