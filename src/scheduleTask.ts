import schedule from 'node-schedule';
import { startOrderConsumer } from './rabbitmq/consumers/orderConsumer';

class TaskScheduler {
  static start() {
    // Schedule a job to run every hour
    schedule.scheduleJob('0 * * * *', () => {
      console.log('Job executed every hour');
      startOrderConsumer();
    });

    // Schedule a job to run at 2 PM every day
    schedule.scheduleJob('0 14 * * *', () => {
      console.log('Job executed at 2 PM daily');
    });

    console.log('Scheduled tasks are running');
  }
}

export default TaskScheduler;
