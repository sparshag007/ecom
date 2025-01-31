import { Sequelize } from 'sequelize-typescript';
import {User} from './models/User';
import { Product } from './models/Product';
import { Order } from './models/Order';
import { SalesInsight } from './models/SalesInsight';
import dotenv from 'dotenv';
import { ProductView } from './models/ProductViews';

console.log('11111111');
dotenv.config();
console.log('222222222');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false,
  models: [User, Product, Order, SalesInsight, ProductView],
});

export default sequelize;
