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
          ? process.env.NEXT_PUBLIC_SITE_URL || "https://your-foodbridge-domain.com"
          : [
              "http://localhost:3000", 
              "http://localhost:3001", 
              "http://localhost:3002", 
              "http://127.0.0.1:3000",
              "http://127.0.0.1:3001",
              "http://127.0.0.1:3002",
              "http://172.20.10.6:3000",
              "http://172.20.10.6:3001",
              "http://172.20.10.6:3002",
              /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(3000|3001|3002)$/,
              /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:(3000|3001|3002)$/,
              /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:(3000|3001|3002)$/
            ],
        methods: ["GET", "POST"],
        credentials: true
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