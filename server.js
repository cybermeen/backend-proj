const express = require('express');
const cors = require('cors');
const { apiKeyMiddleware } = require('./src/utils/apiKeyValidation');
const routes = require('./src/routes/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiKeyMiddleware); // runs before every route that will be defined below

app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});