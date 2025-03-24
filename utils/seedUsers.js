require('dotenv').config(); 
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));

console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the .env file.');
    process.exit(1);
}

const generateUsers = async (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const password = faker.internet.password(10); 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10); 
        } catch (err) {
            console.error(`Error hashing password for user ${i + 1}:`, err.message);
            continue;
        }
        users.push({
            id: 100 + i,
            name: faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: hashedPassword,
            dob: faker.date.past(50, new Date('2012-01-01')),
            phone: faker.phone.phoneNumber('##########'),
            isAdmin: faker.datatype.boolean(),
        });
    }
    return users;
};

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {  
        await connectDb();
        await User.deleteMany({});
        console.log('Existing users deleted.');      
        const userCount = 50;
        const sampleUsers = await generateUsers(userCount);
        const insertedUsers = await User.insertMany(sampleUsers);
        console.log(`${sampleUsers.length} users inserted into the database.`); 
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }  
    process.exit(0);
};
module.exports = seedDatabase;
seedDatabase();