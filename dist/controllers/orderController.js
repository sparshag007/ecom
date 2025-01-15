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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.updateOrder = exports.createOrder = void 0;
const Order_1 = require("../database/models/Order");
const Product_1 = require("../database/models/Product");
// Create Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const userId = req.user.id;
    const { productId, quantity, address, location } = req.body;
    try {
        // Find the product and check if enough inventory is available
        const product = yield Product_1.Product.findByPk(productId);
        if (!product || !product.active) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        if (product.quantity < quantity) {
            res.status(400).json({ message: 'Insufficient inventory' });
            return;
        }
        // Calculate total price
        const totalPrice = product.price * quantity;
        // Create order
        const order = yield Order_1.Order.create({ userId, productId, quantity, totalPrice, address, location });
        // Update inventory
        product.quantity -= quantity;
        yield product.save();
        // Send confirmation response
        res.status(201).json({ message: 'Order created successfully', order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});
exports.createOrder = createOrder;
// Update Order
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const userId = req.user.id;
    const userRole = req.user.role;
    const { orderId, status } = req.body;
    console.log(status);
    if (userRole === 'user' && status !== 'Cancelled') {
        res.status(500).json({ message: 'User not permitted this action' });
        return;
    }
    try {
        const order = yield Order_1.Order.findByPk(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (userRole === 'user' && order.userId !== userId) {
            res.status(500).json({ message: 'User not permitted this action' });
            return;
        }
        order.status = status;
        yield order.save();
        res.status(200).json({ message: 'Order updated successfully', order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order' });
    }
});
exports.updateOrder = updateOrder;
// Get Orders (for a specific user)
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const userId = req.user.id;
    try {
        const orders = yield Order_1.Order.findAll({ where: { userId } });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getOrders = getOrders;
