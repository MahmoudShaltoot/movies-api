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

# Expose the port your NestJS app will run on (default is 3000)
EXPOSE 3000

# Run the NestJS app in production mode
CMD ["npm", "run", "start:dev"]
