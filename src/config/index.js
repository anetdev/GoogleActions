const dotenv = require('dotenv');


// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("Couldn't find .env file");
}

module.exports = {
  fullfilmentPort: parseInt(process.env.FULLFIL_PORT, 0),
  localPort: parseInt(process.env.LOCLAPP_PORT, 0),
  databaseURL: process.env.MONGODB_URI,
  mqtt_host: process.env.MQTT_HOST,
  mqtt_port: parseInt(process.env.MQTT_PORT, 0),
  mqtt_user: process.env.MQTT_USER,
  mqtt_pass: process.env.MQTT_PASS,
};