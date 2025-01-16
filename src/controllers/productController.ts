import { Request, Response } from 'express';
import { Product } from '../database/models/Product';
import { Op } from 'sequelize';
import sequelize from '../database/sequelize';
import redis from '../utils/redisClient';
import RabbitMQ from '../rabbitmq/RabbitMQ';

const CACHE_KEY = 'products';

// Create a product
export const createProduct = async (req: Request, res: Response) => {
  const products = req.body;  // Now expecting an array of products
  // Start a transaction
  const t = await sequelize.transaction();
  try {
      // Use bulkCreate to insert multiple products at once
      const createdProducts = await Product.bulkCreate(products, { transaction: t });
      await t.commit();
      res.status(201).json({ message: 'Products created successfully', createdProducts });
  } catch (error) {
      await t.rollback();
      res.status(500).json({ message: 'Error creating products', error });
  }
};


// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const cachedProducts = await redis.get(CACHE_KEY);
    if (cachedProducts) {
      console.log('Returning cached products');
      res.status(200).json(JSON.parse(cachedProducts));
      return;
    }
    const products = await Product.findAll({
      where: {
        active: true,
      },
    });
    await redis.set(CACHE_KEY, JSON.stringify(products), 'EX', 24 * 60 * 60); // 1 day
    console.log('Returning fresh products');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single active product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        active: true,
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Active product not found' });
      return;
    }
    const productId = product.id;
    RabbitMQ.publish('product_view_queue', { productId }, true)
      .then(() => {
        console.log(`Product ID ${productId} pushed to the queue.`);
      })
      .catch((error) => {
        console.error(`Error pushing product ID ${productId} to the queue:`, error);
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};


// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price, quantity } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    await product.update({ name, description, category, price, quantity });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    // soft delete the product
    product.active = false;
    await product.save();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// search and filter
export const getProductsWithFilters = async (req: Request, res: Response) => {
    const { name, category, minPrice, maxPrice } = req.query;
  
    try {
      const products = await Product.findAll({
        where: {
          active: true,
          ...(name && { name: { [Op.like]: `%${name}%` } }),
          ...(category && { category: { [Op.like]: `%${category}%` } }),
          ...(minPrice && { price: { [Op.gte]: minPrice } }),
          ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
        },
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products with filters', error });
    }
};
  
