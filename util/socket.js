// ./util/socket.js

let io;

const initialize = (socketIO) => {
  io = socketIO;

  // Socket.io connection event
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection if needed
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initialize,
  getIO
};
