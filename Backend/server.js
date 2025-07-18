const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Updated CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Global file upload middleware (for routes that don't need specific configurations)
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// Create uploads directories if they don't exist
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/contestants'),
  path.join(__dirname, 'uploads/proof-of-age')
];

uploadDirs.forEach(dir => {
  if (!require('fs').existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/organizations', require('./routes/api/organizations'));
app.use('/api/pageants', require('./routes/api/pageants'));
app.use('/api/participants', require('./routes/api/participants'));
app.use('/api/contestant-profiles', require('./routes/api/contestantProfile'));
app.use('/api/scoring', require('./routes/api/scoring')); // UNCOMMENTED THIS LINE
app.use('/api/create-checkout-session', require('./routes/api/checkout'));

// Handle production - serve React app
if (process.env.NODE_ENV === 'production') {
  // Set static folder to built React app
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
} else {
  // Simple test route for development
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;