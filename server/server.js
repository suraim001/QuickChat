import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import fs from "fs";
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import { Server, Socket } from 'socket.io';
import path from 'path';
// import { use } from 'react';

// Create Express app and HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
});

// Store online users
export const userSocketMap = {}; // { userId: sockerId }

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) userSocketMap[userId] = socket.id;

    // Emit online user to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

// Middleware setup
app.use(express.json({limit: "10mb"}));
app.use(cors());

// Routes setup

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.get("/api/status", (req, res) => res.send("Server is Live"));

const candidateClientDistPaths = [
    path.resolve(process.cwd(), "client", "dist", "index.html"),
    path.resolve(process.cwd(), "..", "client", "dist", "index.html"),
    path.resolve(process.cwd(), "../client/dist/index.html")
];
const resolvedClientIndexPath = candidateClientDistPaths.find((filePath) => fs.existsSync(filePath));

if (process.env.NODE_ENV === "production" && resolvedClientIndexPath) {
    const clientDistPath = path.dirname(resolvedClientIndexPath);
    app.use(express.static(clientDistPath));

    app.get('/*splat', (req, res) => {
        res.sendFile(resolvedClientIndexPath);
    });
}

// Connect to MongoDB
await connectDB();

// if(process.env.NODE_ENV !== "production"){
// }

const PORT = process.env.PORT ||  5000;
    server.listen(PORT, ()=> console.log("Server is running on PORT: "+ PORT));


// Export server for vercel
export default server;
