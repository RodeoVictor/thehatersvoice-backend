kindly use npm install to install any dependencies, and nodemon server.js to run the server

If you would like to seed users: node seedUsers.js

# make sure to create this first and foremost

.env file
MONGO_URI=mongodb://host.docker.internal:27017/thehatersvoice
# MONGO_URI=mongodb://localhost:27017/thehatersvoice(this is without the docker)
JWT_SECRET=your_secret_key

PORT=5001
