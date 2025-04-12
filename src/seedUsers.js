require('dotenv').config(); 
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 


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
            name: faker.name.findName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: hashedPassword,
            dob: faker.date.past(50, new Date('2012-01-01')),
            phone: faker.phone.phoneNumber('##########'),
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
    connectDb();
    try {       
        User.deleteMany({});
        console.log('Existing users deleted.');      
        const userCount = parseInt(process.env.USER_COUNT || '50', 10); 
        const sampleUsers = await generateUsers(userCount);
        for (const userData of sampleUsers) {
            const user = new User(userData); 
            user.save(); 
            console.log(`Inserted user with username: ${user.username}`);
        }    
        console.log(`${sampleUsers.length} users inserted into the database.`); 
        process.exit(0); 
    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    }
};
module.exports = seedDatabase;
// seedDatabase();