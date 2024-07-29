FROM node:22.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3004

# Run the start script when the container launches
CMD ["./start.sh"]