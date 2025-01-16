import RabbitMQ from '../RabbitMQ';

export const startOrderConsumer = async (): Promise<void> => {
  await RabbitMQ.consume('orderQueue', async (message) => {
    console.log('Processing order:', message);

    // Example: Send a notification or update a third-party service
    console.log(`Order processed: Order ID ${message.orderId}`);
  });
};
