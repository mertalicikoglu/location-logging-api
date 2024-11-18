# Dockerfile file for Node.js application.
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["node", "dist/main"]
