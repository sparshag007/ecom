import { Server } from "socket.io";
import log from "../utils/logger";

export const initializeSocket = (server: any): Server => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    log.info(`Client connected with ID: ${socket.id}`);

    // Handle incoming messages
    socket.on("user-message", (message) => {
      log.info(`Received message from ${socket.id}: ${message}`);
      socket.emit("response", "Message received"); // Respond to the client
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
      log.info(`Client ${socket.id} disconnected`);
    });
  });

  return io;
};
