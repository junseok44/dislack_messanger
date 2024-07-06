# Dockerfile for React client
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
