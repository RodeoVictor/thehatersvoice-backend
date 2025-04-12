"use strict";

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Auto-incremented primary key
    name: { type: String, required: [true, 'Name is required'] },
    username: { type: String, unique: true, required: [true, 'Username is required'] },
    email: { type: String, unique: true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    dob: { type: Date, required: [true, 'Date of Birth is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    isAdmin: { type: Boolean, default: false } // Added for superuser methods
});

// Add the auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 100 });

module.exports = mongoose.model('User', userSchema);