import express from "express";
import { WebSocketServer } from "ws";
import cors from 'cors';
import sequelize from './database/sequelize';
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import './utils/redisClient';
import reportRoutes from "./routes/reportRoutes";
import RabbitMQ from "./rabbitmq/RabbitMQ";
import TaskScheduler from "./scheduleTask";
import rateLimit from 'express-rate-limit';
import log from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT, 10) : 8080;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Include rate limit info in the response headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// WebSocket setup
const wss = new WebSocketServer({ port: WEBSOCKET_PORT});

wss.on("connection", (ws) => {
  log.info("Client connected");

  ws.on("message", (message) => {
    log.info(`Received: ${message}`);
    ws.send("Message received");
  });

  ws.on("close", () => log.info("Client disconnected"));
});

app.use(express.json());
app.use(cors());
app.use(limiter);

(async () => {
  await RabbitMQ.connect(RABBITMQ_URL);
})();

TaskScheduler.start();

const runMigrations = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    log.info("Connection to DB has been established successfully.");
    
    // Run pending migrations (this syncs the DB schema with models)
    await sequelize.sync({ alter: true });
    
    log.info("Migrations completed successfully!");
  } catch (error) {
    log.error("Error running migrations: ", error);
  }
};

runMigrations().then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/product', productRoutes);
  app.use('/api/order', orderRoutes);
  app.use('/api/report', reportRoutes);

  app.listen(PORT, () => {
    log.info(`Application is starting up at PORT ${PORT}...`);
  });
})
