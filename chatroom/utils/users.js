import privateschema from "../Models/Messagemodel.js";
import { v4 as uuidv4 } from "uuid";
export const onlineusers =async(sender,receiver)=>{

return true

}
export const joinroom = async (data, socket) => {

  const sender = socket.decoded.userId;
 
   const { receiver } = data;
  const userchats = await privateschema.findOne({
    $and: [{ "participants.user": sender }, { "participants.user": receiver }],
  });

  if (!userchats) {
    // If chat doesn't exist, create a new private chat
    const roomid = uuidv4();
    const newChat = new privateschema({
      participants: [{ user: sender,status:"online" }, { user: receiver,status:"offline" }],
      messages: [],
      roomid: roomid,
    });

    const createdChat = await newChat.save();

    if (!createdChat) {
      throw new Error("Not Created!");
    }
    socket.join(roomid);
  } else {


    const updatedschema = await privateschema.updateMany(
      {
        participants: {
          $all: [
            { $elemMatch: { user: sender } },
            { $elemMatch: { user: receiver } },
          ],
        },
        messages: { $elemMatch: { receiver: sender } },
      },
      { $set: { "messages.$[elem].Isseen": true } },
      { arrayFilters: [{ "elem.receiver": sender }] }
    );
 
    socket.join(userchats.roomid);
    socket.to(userchats.roomid).emit("userStatus", { status: "online" });
  }
};



export const leaveroom = async (data, socket) => {
  const sender = socket.decoded.userId;
  const { receiver } = data;
  const userchats = await privateschema.findOne({
    $and: [{ "participants.user": sender }, { "participants.user": receiver }],
  });

  const { roomid } = userchats.roomid;
  socket.leave(roomid);
  onlineuers.delete(sender);
  console.log(onlineuers);
  socket.to(userchats.roomid).emit("userStatus", { status: "offline" });
};



export const offline = (data, socket) => {
  const sender = socket.decoded.userId;
  onlineuers.delete(sender);

  const { roomid } = data;
  socket.leave(roomid);

  socket.disconnect();
  socket
    .to(data.roomid)
    .emit("userStatus", { status: "offline", user: data.username });
};


