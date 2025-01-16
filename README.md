This is a Node.js project utilizing **TypeScript**, **Sequelize**, and **PostgreSQL**. It also supports RabbitMQ for message brokering and Redis for caching. Below are the steps to get the project up and running.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Docker](https://www.docker.com/get-started) (if using Docker for PostgreSQL, Redis, etc.)
- [PostgreSQL](https://www.postgresql.org/download/) (or Dockerized version)
- [Redis](https://redis.io/download) (or Dockerized version)
- [RabbitMQ](https://www.rabbitmq.com/download.html) (if needed)

---

## Installation

1. **Clone the repository:**

   git clone https://github.com/sparshag007/ecom.git
   cd <into the project>

2. **Install the dependencies:**

    npm install

3. **Set up environment variables:**

    Create a .env file in the root directory of the project. Here's an example of what to include:

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=test-db
   DB_USER=postgres
   DB_PASSWORD=postgres
   REDIS_HOST=localhost
   REDIS_PORT=6379
   RABBITMQ_URL=amqp://localhost
   JWT_SECRET=your-jwt-secret

4. Running the Project

    Build the TypeScript files:

    npm run build

    Start the application:

    npm run start
    
    This will start the application using the compiled JavaScript files in the dist/ directory.

5. Running Migrations
    
    If you need to run database migrations for Sequelize, use the following command:

    npm run migrate

    This will run all pending migrations to update your PostgreSQL database schema.

    To create a new migration, use the following command:

    npm run create-script --name your-migration-name




