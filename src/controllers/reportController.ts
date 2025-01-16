import { Request, Response } from 'express';
import { Order } from '../database/models/Order';
import { Op, Sequelize } from 'sequelize';
import moment from 'moment';

// Function to get total sales with filters
export const getTotalSales = async (req: Request, res: Response) => {
  const { location, lastMonth, lastYear } = req.query;

  try {
    const filterConditions: any = {};

    if (location) {
      filterConditions.location = location;
    }

    // Filter for last month
    if (lastMonth) {
      const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate();
      const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate();
      filterConditions.createdAt = {
        [Op.between]: [startOfMonth, endOfMonth]
      };
    }

    // Filter for last year
    if (lastYear) {
      const startOfYear = moment().subtract(1, 'years').startOf('year').toDate();
      const endOfYear = moment().subtract(1, 'years').endOf('year').toDate();
      filterConditions.createdAt = {
        [Op.between]: [startOfYear, endOfYear]
      };
    }

    // Get the total sales using the applied filters
    const totalSales = await Order.sum('totalPrice', {
      where: filterConditions,
      // logging: (sql) => {
      //   console.log('Raw SQL Query:', sql); // Log the raw SQL query
      // }
    });

    res.status(200).json({ totalSales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total sales', error });
  }
};
