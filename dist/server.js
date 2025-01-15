"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const sequelize_1 = __importDefault(require("./database/sequelize"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
require("./utils/redisClient");
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const app = (0, express_1.default)();
const PORT = 3000;
// WebSocket setup
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        ws.send("Message received");
    });
    ws.on("close", () => console.log("Client disconnected"));
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/product', productRoutes_1.default);
app.use('/api/order', orderRoutes_1.default);
app.use('/api/report', reportRoutes_1.default);
sequelize_1.default.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
