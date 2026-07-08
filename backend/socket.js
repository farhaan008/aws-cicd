let io;

module.exports = {
  init(serverIO) {
    io = serverIO;
    io.on("connection", (socket) => {
      console.log("User connected", socket.id);
    });
  },
  getIO() {
    if (!io) throw new Error("Socket not initialized");
    return io;
  }
};
