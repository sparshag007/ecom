import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQ {
  private static connection: Connection;
  private static channel: Channel;

  static async connect(url: string): Promise<void> {
    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
    }
  }

  static async publish(queue: string, message: Record<string, unknown>, append: boolean = false): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      if (append) {
        const messages: Array<Record<string, unknown>> = [];
        await this.channel.consume(queue, (msg) => {
            if (msg) {
                messages.push(JSON.parse(msg.content.toString()));
                this.channel.nack(msg, false, true);
            }
        }, { noAck: false });
        console.log(`Existing messages in queue "${queue}":`, messages);
        messages.push(message);
        console.log('Final messages in queue after append:', messages);
      }
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(`Message published to queue "${queue}":`, message);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }

  static async consume(queue: string, onMessage: (msg: Record<string, unknown>) => void): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      console.log(`Waiting for messages in queue "${queue}"...`);

      this.channel.consume(
        queue,
        (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString());
            console.log('Message received:', content);

            // Call the provided handler
            onMessage(content);

            // Acknowledge the message
            this.channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error('Error consuming messages:', error);
    }
  }

  static async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
    console.log('RabbitMQ connection closed');
  }
}

export default RabbitMQ;
