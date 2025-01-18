// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen("4000");

import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

// Add user to the list of online users
const addUser = (userId, socketId) => {
  const existingUser = onlineUsers.find((user) => user.userId === userId);
  if (!existingUser) {
    onlineUsers.push({ userId, socketId });
  }
};

// Remove user from the list of online users
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// Get user by userId
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // console.log("New user connected: " + socket.id);

  // When a new user connects
  socket.on("newUser", (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    addUser(userId, socket.id);
    // console.log(`User ${userId} added`);
  });

  // When a user sends a message
  socket.on("sendMessage", ({ receiverId, data }) => {
    if (!receiverId || !data) {
      console.error("Receiver ID or message data is missing");
      return;
    }
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent to user ${receiverId}`);
    } else {
      console.error(`User ${receiverId} is not online`);
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    removeUser(socket.id);
    // console.log("User disconnected: " + socket.id);
  });
});

io.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
