const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicFilename: { type: String } // Add profilePicUrl field to store image URL
}));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Unique filename with timestamp
  }
});

const upload = multer({ storage });

// Endpoint for image upload
// Endpoint for image upload
app.post('/api/upload/:username', upload.single('image'), async (req, res) => {
  const username = req.params.username;
  const file = req.file;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's profile picture filename in database
    user.profilePicFilename = file.filename; // Save only the filename
    await user.save();

    res.json({ message: 'Profile picture updated successfully', profilePicFilename: user.profilePicFilename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to update profile picture', error: error.message });
  }
});

// Endpoint to get user by username
app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username;
  const profilePicFilename = req.params.profilePicFilename;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.json({
      username: user.username,
      profilePicFilename: user.profilePicFilename; // Return profilePicUrl in response
      
      
    });
    console.log(profilePicFilename);
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Example endpoint for sign-up
app.post('/api/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log(`Sign up failed: Email or Username already exists`);
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();
    console.log(`User signed up: Email - ${email}, Username - ${username}, Password - ${password}`);
    res.json({ message: 'Sign up successful' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Sign up failed', error: error.message });
  }
});

// Endpoint for sign-in
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      console.log(`User signed in: Username - ${username}`);
      res.json({ message: 'User found' });
    } else {
      console.log(`User not found: Username - ${username}`);
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Sign in failed', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
