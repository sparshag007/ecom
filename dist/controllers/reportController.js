"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalSales = void 0;
const Order_1 = require("../database/models/Order"); // Assuming you have Order model
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment")); // You can use moment.js or any other date library
// Function to get total sales with filters
const getTotalSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { location, lastMonth, lastYear } = req.query;
    try {
        // Create an object to hold the filter conditions
        const filterConditions = {};
        // Filter by location if provided
        if (location) {
            filterConditions.location = location;
        }
        // Filter for last month
        if (lastMonth) {
            const startOfMonth = (0, moment_1.default)().subtract(1, 'months').startOf('month').toDate();
            const endOfMonth = (0, moment_1.default)().subtract(1, 'months').endOf('month').toDate();
            filterConditions.createdAt = {
                [sequelize_1.Op.between]: [startOfMonth, endOfMonth]
            };
        }
        // Filter for last year
        if (lastYear) {
            const startOfYear = (0, moment_1.default)().subtract(1, 'years').startOf('year').toDate();
            const endOfYear = (0, moment_1.default)().subtract(1, 'years').endOf('year').toDate();
            filterConditions.createdAt = {
                [sequelize_1.Op.between]: [startOfYear, endOfYear]
            };
        }
        // Get the total sales using the applied filters
        const totalSales = yield Order_1.Order.sum('totalPrice', {
            where: filterConditions,
            logging: (sql) => {
                console.log('Raw SQL Query:', sql); // Log the raw SQL query
            }
        });
        res.status(200).json({ totalSales });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching total sales', error });
    }
});
exports.getTotalSales = getTotalSales;
