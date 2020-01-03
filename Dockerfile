FROM node:latest

# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install bot package
COPY package.json /usr/src/bot
RUN npm install

# Install nodemon
RUN npm install nodemon -g

# Copy source files
COPY . /usr/src/bot

# Start the bot
CMD ["nodemon", "index.js"]