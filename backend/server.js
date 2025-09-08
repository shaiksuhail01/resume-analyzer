require('dotenv').config();
const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// ✅ CORS setup (open for now)
app.use(cors({
  origin: "*",  // allow all for development
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/resumes', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log('Server listening on ' + PORT);
});
