kindly use npm install to install any dependencies, and nodemon server.js to run the server

If you would like to seed users: node seedUsers.js

.env file
MONGO_URI=mongodb://localhost:27017/thehatersvoice
PORT=5001

for testing use the following:

npm test -- tests/commentController.test.js
npm test -- tests/postController.test.js
npm test -- tests/userController.test.js