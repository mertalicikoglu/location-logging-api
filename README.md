# Location Logging API

This project is a Location Logging API built using NestJS and TypeScript. The API allows users to submit their locations, log entry data for predefined areas, and provides endpoints for retrieving logs and managing geographic areas.

## Features
- **Location Submission**: Users can submit their current location, which will be checked against predefined areas.
- **Area Management**: CRUD operations for areas.
- **Location Logging**: When a user enters an area, the event is logged.
- **Throttling**: Throttle requests to prevent abuse (rate limit set to 5 requests per minute per user).
- **RabbitMQ Integration**: Asynchronous processing for location submissions.
- **Redis Cache**: Caching for improved performance.
- **Swagger Documentation**: Automatically generated API documentation.
- **Health Check Endpoint**: Monitoring the health status of various services.
- **Custom Logger**: A custom logger using Winston for structured logging.

## Technologies Used
- **NestJS**: Backend framework for building scalable server-side applications.
- **TypeScript**: Typed JavaScript used for development.
- **TypeORM**: Object Relational Mapper (ORM) for database management.
- **PostgreSQL**: Database for storing user and location data.
- **RabbitMQ**: Message broker for managing location submissions.
- **Redis**: Cache for faster access to frequently queried data.
- **Swagger**: API documentation using `@nestjs/swagger`.
- **Winston**: Logging framework used to provide a structured logging format.
- **amqplib**: Used to connect to RabbitMQ for managing message queues.
- **Docker**: Containerization of services for local development.

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v6 or higher)
- **Docker** and **Docker Compose** (optional, for containerized development)
- **PostgreSQL** (v14 or higher)
- **Redis**
- **RabbitMQ**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mertalicikoglu/location-logging-api.git
   cd location-logging-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory. Example configuration:
   ```env
   DATABASE_URL=postgres://myuser:mypassword@localhost:5432/location_data
   RABBITMQ_URI=amqp://guest:guest@localhost:5672
   THROTTLE_TTL=60
   THROTTLE_LIMIT=5
   ```

4. Run the PostgreSQL and Redis servers, or use Docker Compose for easier setup:
   ```bash
   docker-compose up -d
   ```

### Running the Application
To run the application in development mode:
```bash
npm run start:dev
```

To run the application in production mode:
```bash
npm run build
npm run start:prod
```

### Running with Docker
You can also run the application using Docker:
```bash
docker-compose up --build
```

### Testing the API
You can test the API using tools like **Postman** or **cURL**. Swagger documentation is also available at `http://localhost:3000/api` for easy testing and exploration of endpoints.

### Example Requests
- **Add Area**:
  ```bash
  curl -X POST http://localhost:3000/areas -H "Content-Type: application/json" -d '{"name": "Kadikoy Beach", "latitude": 40.991728, "longitude": 29.025716, "radius": 400}'
  ```

- **Add Location**:
  ```bash
  curl -X POST http://localhost:3000/locations -H "Content-Type: application/json" -d '{"userId": "user1", "latitude": 40.991728, "longitude": 29.025716}'
  ```

- **Get Logs**:
  ```bash
  curl http://localhost:3000/logs
  ```

## Project Structure
- **src/**: Main source code directory.
  - **common/**: Common services and providers like logging and RabbitMQ integration.
  - **location/**: Location-related logic and controllers.
  - **area/**: Area-related CRUD operations.
  - **log/**: Log-related operations.
  - **health/**: Health check endpoint.
- **docker-compose.yml**: Docker configuration for running RabbitMQ, Redis, and PostgreSQL.
- **README.md**: Documentation for running and developing the project.


## License
This project is licensed under the MIT License.

## Contact
For any questions or suggestions, feel free to contact the author.

