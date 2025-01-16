import { Request, Response } from 'express';
import {Order} from '../database/models/Order';
import {Product} from '../database/models/Product';
import RabbitMQ from '../rabbitmq/RabbitMQ';
import log from "../utils/logger";

export const createOrder = async (req: Request, res: Response) => {
  
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    const userId = req.user.id;
  
    const { productId, quantity, address, location } = req.body;

    try {
    // Find the product and check if enough inventory is available
    const product = await Product.findByPk(productId);
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

    const order = await Order.create({ userId, productId, quantity, totalPrice, address, location });

    // Publish the order data to RabbitMQ
    RabbitMQ.publish('orderQueue', {
        orderId: order.id,
        userId: req.user.id,
        productId,
        quantity,
        totalPrice,
        address,
        location,
    });

    // Update inventory
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Error creating order' });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const userId = req.user.id;
    const userRole = req.user.role;
    const { orderId, status } = req.body;
    if (userRole === 'user' && status !== 'Cancelled') {
        res.status(500).json({ message: 'User not permitted this action' });
        return;
    }
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (userRole === 'user' && order.userId !== userId) {
            res.status(500).json({ message: 'User not permitted this action' });
            return;
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        log.error(error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

// Get Orders (for a specific user)
export const getOrders = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const userId = req.user.id;
    try {
        const orders = await Order.findAll({ where: { userId } });
        res.status(200).json(orders);
    } catch (error) {
        log.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};
