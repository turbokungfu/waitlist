// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config({ path: "./config/.env" });

// Define a schema for your user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

// Define a model using the schema
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware for serving static files
app.use(express.static('public'));

// Middleware for parsing JSON requests
app.use(express.json());

// Configure session middleware with MongoDB store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  clientPromise: mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }),
  ttl: 7 * 24 * 60 * 60, // Session TTL (7 days)
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// In your signup route handler, create a new user document
app.post('/signup', (req, res) => {
  const { name, email, role } = req.body;

    // Create a new user document and save it to the database
    const user = new User({ name, email, role });
    user.save()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error('Error saving user to database:', error);
        res.sendStatus(500);
      });
  });

// Catch-all route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
