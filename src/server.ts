import express from "express";
import { createServer } from "http";
import cors from 'cors';
import sequelize from './database/sequelize';
import authRoutes from "./routes/authRoutes";
import { initializeSocket } from "./middlewares/websocket"; // Import socket middleware
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import './utils/redisClient';
import reportRoutes from "./routes/reportRoutes";
import RabbitMQ from "./rabbitmq/RabbitMQ";
import TaskScheduler from "./scheduleTask";
import log from "./utils/logger";
import path from 'path';
// import {availableParallelism, cpus} from 'os';
import session from "express-session";
import passport from "passport";
import { limiter } from "./middlewares/rateLimiter";
import './middlewares/passportConfig';
console.log('3333333');

const app = express();
const server = createServer(app);

// Initialize Passport.js
app.use(passport.initialize());
// app.use(passport.session());

// Create session for passport oAuth authz and authz
// Middleware for sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// console.log(cpus().length, availableParallelism());

const PORT = process.env.PORT || 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

initializeSocket(server);
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));

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
  app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  server.listen(PORT, () => {
    log.info(`Application is starting up at PORT ${PORT}...`);
  });
});
