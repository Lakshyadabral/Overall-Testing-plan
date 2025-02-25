require('dotenv').config(); 

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const User = require("../models/user");
const Listing = require("../models/listing");

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.ATLASDB_URL);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

test('Home page should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
});

test('User signup should create a new user', async () => {
    const newUser = new User({
        username: "testuser",
        email: "testuser@example.com"
    });

    await newUser.setPassword("Test@123");
    const savedUser = await newUser.save();

    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("testuser@example.com");

    await User.deleteOne({ email: "testuser@example.com" });
});

test('Should create a new listing', async () => {
    const newListing = new Listing({
        title: "Test Listing",
        description: "This is a test listing",
        location: "Test City",
        country: "Test Country",
        price: 100,
        category: "rooms",
        owner: new mongoose.Types.ObjectId(),
        geometry: { type: "Point", coordinates: [0, 0] } 
    });

    const savedListing = await newListing.save();
    expect(savedListing.title).toBe("Test Listing");

    await Listing.deleteOne({ _id: savedListing._id });
});

test('Invalid route should return 404', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.statusCode).toBe(404);
});


test('Database should connect successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1); 
});
