"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./models/User");
const Product_1 = require("./models/Product");
const Order_1 = require("./models/Order");
// Create a new Sequelize instance
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'test-db',
    logging: false,
    models: [User_1.User, Product_1.Product, Order_1.Order], // Automatically load models from the models folder
});
exports.default = sequelize;
