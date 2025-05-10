const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "../frontend"))); // Static files from the frontend

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // User joins with their username
  socket.on("join", (username) => {
    socket.username = username;
  });

  // Handle chat messages
  socket.on("chat message", ({ user, message }) => {
    io.emit("chat message", { user, message });  // Broadcast to all users
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
