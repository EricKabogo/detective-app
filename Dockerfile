# Use the official Node.js LTS image as the base image
FROM --platform=linux/amd64 node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "./dist/index.js"]
