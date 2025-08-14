import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import Message from "./db/models/Message";

export const startSocketServer = () => {
  const httpServer = createServer();

  const io = new SocketIOServer(httpServer, {
   /*  cors: { origin: "*" }, */
     cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  }
  });

  const users = new Map(); 

  io.on("connection", (socket) => {
    console.log(`Client verbunden: ${socket.id}`);

    socket.on("register_user", (userId) => {
      socket.data.userId = userId;
      users.set(userId, socket.id);
    });

   socket.on("send_message", async (msg) => {
  try {
    const savedMessage = await Message.create(msg);
    const receiverSocketId = users.get(msg.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", savedMessage);
    } else {

    }

    socket.emit("receive_message", savedMessage);
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
});

    socket.on("disconnect", () => {
      if (socket.data.userId) {
        users.delete(socket.data.userId);
      }
  
    });
  });


  const port = 5000;
  httpServer.listen(port, () => {
    console.log(`Socket.IO läuft auf http://localhost:${port}`);
  });
};
