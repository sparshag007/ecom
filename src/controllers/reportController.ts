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

// average order value
type AOVResult = {
  totalOrderValue: string;
  totalUsers: string;
};

export const getAverageOrderValue = async (req: Request, res: Response) => {
  const { location, lastMonth, lastYear } = req.query;
  try {
    const filterConditions: any = {};
    if (location) {
      filterConditions.location = location;
    }
    if (lastMonth) {
      const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate();
      const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate();
      filterConditions.createdAt = { [Op.between]: [startOfMonth, endOfMonth] };
    }
    if (lastYear) {
      const startOfYear = moment().subtract(1, 'years').startOf('year').toDate();
      const endOfYear = moment().subtract(1, 'years').endOf('year').toDate();
      filterConditions.createdAt = { [Op.between]: [startOfYear, endOfYear] };
    }
    const result = await Order.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'totalOrderValue'], // Total sales
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('userId'))), 'totalUsers'], // Unique users
      ],
      where: filterConditions,
      raw: true, // Return plain objects instead of Sequelize model instances
    }) as unknown as AOVResult[]; // Explicitly define the query result structure
    const totalOrderValue = parseFloat(result[0]?.totalOrderValue || '0');
    const totalUsers = parseInt(result[0]?.totalUsers || '0', 10);
    // Calculate AOV
    const averageOrderValue = totalUsers > 0 ? totalOrderValue / totalUsers : 0;
    res.status(200).json({ averageOrderValue });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average order value', error });
  }
};
