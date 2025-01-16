import schedule from 'node-schedule';
import { startOrderConsumer, startProductViewConsumer } from './rabbitmq/consumers/orderConsumer';
import log from "./utils/logger";

class TaskScheduler {
  static start() {
    // Schedule a job to run every hour
    schedule.scheduleJob('0 * * * *', () => {
      log.info('Job executed every hour');
      startOrderConsumer();
    });

    schedule.scheduleJob('* * * * *', () => {
        log.info('Job executed every minute');
        startProductViewConsumer();
    });

    // Schedule a job to run at 2 PM every day
    schedule.scheduleJob('0 14 * * *', () => {
      log.info('Job executed at 2 PM daily');
    });

    log.info('Scheduled tasks are running');
  }
}

export default TaskScheduler;
