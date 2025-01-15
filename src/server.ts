import express from "express";
import { WebSocketServer } from "ws";
import cors from 'cors';
import sequelize from './database/sequelize';
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import './utils/redisClient';
import reportRoutes from "./routes/reportRoutes";

const app = express();
const PORT = 3000;

// WebSocket setup
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send("Message received");
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/report', reportRoutes)

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
