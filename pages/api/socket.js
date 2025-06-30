import { Server } from "socket.io";

let userCount = 0;

export default function handler(req, res) {
  // Only allow socket initialization on specific HTTP methods
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (res.socket.server.io) {
    console.log("Socket already running");
  } else {
    console.log("Socket is initializing");
    
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production" 
          ? "https://your-domain.com" // Replace with your actual domain
          : "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      userCount++;
      
      // Send current user count to all clients
      io.emit("user count", userCount);

      // Handle chat messages
      socket.on("chat message", (msg) => {
        console.log("Message received:", msg);
        // Broadcast to all clients including sender
        io.emit("chat message", {
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString(),
          socketId: socket.id
        });
      });

      // Handle typing events
      socket.on("typing", (data) => {
        socket.broadcast.emit("typing", {
          ...data,
          socketId: socket.id
        });
      });

      socket.on("stop typing", (data) => {
        socket.broadcast.emit("stop typing", {
          ...data,
          socketId: socket.id
        });
      });

      // Handle user joining a room (optional)
      socket.on("join room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.to(room).emit("user joined", {
          socketId: socket.id,
          room: room
        });
      });

      // Handle user leaving a room (optional)
      socket.on("leave room", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
        socket.to(room).emit("user left", {
          socketId: socket.id,
          room: room
        });
      });

      socket.on("disconnect", (reason) => {
        console.log("User disconnected:", socket.id, "Reason:", reason);
        userCount = Math.max(0, userCount - 1);
        
        // Send updated user count to all clients
        io.emit("user count", userCount);
        
        // Broadcast that user stopped typing (cleanup)
        socket.broadcast.emit("stop typing", {
          socketId: socket.id
        });
      });
    });
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
}