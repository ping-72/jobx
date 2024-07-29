# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the client
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Move back to the root directory
WORKDIR /usr/src/app

# Copy the start script
COPY start.sh .
RUN chmod +x start.sh

# Make port 3000 available outside the container
EXPOSE 3000

# Run the start script when the container launches
CMD ["./start.sh"]