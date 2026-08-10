const app = require('./app');

const PORT = 8000;
app.listen(PORT, '127.0.0.1', () =>
  console.log(`Server is listening on port: ${PORT}...`),
);
