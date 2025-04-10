# Use Node.js 20 as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all application files to the container
COPY . .

# Build the NestJS app (usually outputs to `dist/` folder)
RUN npm run build

# Expose the port your NestJS app will run on (default is 8080)
EXPOSE 8080

# Run test cases before starting the app
CMD npm run test & npm run migration:run && npm run seed & npm run start:dev
