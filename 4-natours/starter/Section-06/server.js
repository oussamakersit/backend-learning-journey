const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.REMOTE_DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then(() => {
    console.log(`DB connected successfully`);
  })
  .catch((err) => {
    console.log(`DB connection failed: ${err}`);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}...`));

// console.log(process.env);
