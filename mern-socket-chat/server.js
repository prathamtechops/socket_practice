// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let messages = []; // In-memory store for messages

io.on("connection", (socket) => {
  console.log("New client connected");

  // Send existing messages to the new client
  socket.emit("loadMessages", messages);

  socket.on("sendMessage", (message) => {
    messages.push(message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => console.log("Server is running on port 4000"));
