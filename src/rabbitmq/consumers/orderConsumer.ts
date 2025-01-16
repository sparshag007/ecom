import { ProductView } from '../../database/models/ProductViews';
import RabbitMQ from '../RabbitMQ';
import { Sequelize } from 'sequelize';

export const startOrderConsumer = async (): Promise<void> => {
  await RabbitMQ.consume('orderQueue', async (message) => {
    console.log('Processing order:', message);
    console.log(`Order processed: Order ID ${message.orderId}`);
  });
};

export const startProductViewConsumer = async (): Promise<void> => {
  await RabbitMQ.consume('product_view_queue', async (message) => {
    try {
      const { productId } = message;
      if (!productId) {
        console.error('Invalid message: productId is missing');
        return;
      }
      console.log(`Processing product view for product ID: ${productId}`);
      // Check if a row already exists for the productId
      const productView = await ProductView.findOne({ where: { productId } });
      if (productView) {
        await productView.update({
          views: productView.views + 1,
        });
        console.log(`Incremented views for product ID: ${productId}`);
      } else {
        await ProductView.create({
          productId,
          views: 1,
        });
        console.log(`Created new product view entry for product ID: ${productId}`);
      }
    } catch (error) {
      console.error('Error processing product view:', error);
    }
  });
};
