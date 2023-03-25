const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// database
mongoose
  .connect('mongodb://localhost:27017/gold-fintech-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

const walletTransactionRoutes = require('./routes/walletTransaction');
const goldTransactionRoutes = require('./routes/goldTransaction');
const userRoutes = require('./routes/user');

app.use('/walletTransaction', walletTransactionRoutes);
app.use('/goldTransaction', goldTransactionRoutes);
app.use('/user', userRoutes);

// use for start  server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});