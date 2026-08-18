const express = require('express');
const cors = require('cors');
const { apiKeyMiddleware } = require('./src/utils/apiKeyValidation');
const routes = require('./src/routes/routes');
const errorMessages = require('./src/utils/errorMessages');
const HTTP_STATUS = require('./src/utils/httpStatusCodes');
const path = require('path');

const app = express();


// Mounted at ROOT ("/"), not "/public" — this is what makes
// a file at public/products/x.jpg reachable at just /products/x.jpg
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(apiKeyMiddleware); // runs before every route that will be defined below

app.use('/', routes);

// 404 catch-all — must come after every route above it
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: errorMessages.getRouteNotFoundMessage() });
});

// Centralized error handler — must be the absolute last thing registered
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: errorMessages.getMalformedRequestMessage() });
  }
  if (err.name === 'MulterError' || err.message?.includes('images are allowed')) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: err.message });
  }
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: errorMessages.getUnexpectedErrorMessage() });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});