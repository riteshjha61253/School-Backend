require('dotenv').config();
const express = require('express');
const connection = require('./config/db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', schoolRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});