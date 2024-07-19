import { sendMessage} from '../usercontroller.js'
import { joinroom, leaveroom,offline,onlineusers} from "../../utils/users.js";
import privateschema from '../../Models/Messagemodel.js';
export function setupSocketIO(io) {
 
  io.on("connection", async(socket) => {
const userId=socket.decoded.userId
    if (!socket?.decoded?.userId) {
      return socket.disconnect();
    }
    const updatedSchema = await privateschema.updateOne(
      { 'participants.user': userId },
      { $set: { 'participants.$.status': 'online' } }
    );
    
    socket.on("joinroom", (data) => {
    
  
      joinroom(data, socket);  
 
      
    });
  
    socket.on("leaveroom", (data) => {
      leaveroom(data, socket);

    
    });
  
    socket.on("offline", (data) => {

      offline(data,socket)
    
    });
      
    
 
    socket.on("messagesent", (msg) => {
  
      sendMessage(msg, socket);
    });

    socket.on("disconnect", async() => {
      const updatedSchema = await privateschema.updateOne(
        { 'participants.user': userId },
        { $set: { 'participants.$.status': 'offline' } }
      );
      
      console.log("User disconnected", socket.id);
      
    });
  });
}


