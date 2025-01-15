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
exports.getProductsWithFilters = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = require("../database/models/Product");
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const CACHE_KEY = 'products';
// Create a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = req.body; // Now expecting an array of products
    // Start a transaction
    const t = yield sequelize_2.default.transaction();
    try {
        // Use bulkCreate to insert multiple products at once
        const createdProducts = yield Product_1.Product.bulkCreate(products, { transaction: t });
        yield t.commit();
        res.status(201).json({ message: 'Products created successfully', createdProducts });
    }
    catch (error) {
        yield t.rollback();
        res.status(500).json({ message: 'Error creating products', error });
    }
});
exports.createProduct = createProduct;
// Get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedProducts = yield redisClient_1.default.get(CACHE_KEY);
        if (cachedProducts) {
            console.log('Returning cached products');
            res.status(200).json(JSON.parse(cachedProducts));
            return;
        }
        const products = yield Product_1.Product.findAll({
            where: {
                active: true,
            },
        });
        yield redisClient_1.default.set(CACHE_KEY, JSON.stringify(products), 'EX', 24 * 60 * 60); // 1 day
        console.log('Returning fresh products');
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
exports.getAllProducts = getAllProducts;
// Get a single active product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findOne({
            where: {
                id: req.params.id,
                active: true,
            },
        });
        if (!product) {
            res.status(404).json({ message: 'Active product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});
exports.getProductById = getProductById;
// Update a product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category, price, quantity } = req.body;
        const product = yield Product_1.Product.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        yield product.update({ name, description, category, price, quantity });
        res.status(200).json({ message: 'Product updated successfully', product });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findByPk(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        // soft delete the product
        product.active = false;
        yield product.save();
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});
exports.deleteProduct = deleteProduct;
// search and filter
const getProductsWithFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, category, minPrice, maxPrice } = req.query;
    try {
        const products = yield Product_1.Product.findAll({
            where: Object.assign(Object.assign(Object.assign(Object.assign({ active: true }, (name && { name: { [sequelize_1.Op.like]: `%${name}%` } })), (category && { category: { [sequelize_1.Op.like]: `%${category}%` } })), (minPrice && { price: { [sequelize_1.Op.gte]: minPrice } })), (maxPrice && { price: { [sequelize_1.Op.lte]: maxPrice } })),
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products with filters', error });
    }
});
exports.getProductsWithFilters = getProductsWithFilters;
