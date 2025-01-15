import { Sequelize } from 'sequelize-typescript';
import {User} from './models/User';
import { Product } from './models/Product';
import { Order } from './models/Order';
import { SalesInsight } from './models/SalesInsight';


// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'test-db',
  logging: false,
  models: [User, Product, Order, SalesInsight], // Automatically load models from the models folder
});

export default sequelize;
