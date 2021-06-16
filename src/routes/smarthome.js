// Import the appropriate service
const { smarthome } = require('actions-on-google');
const smartDeviceService = require("../services/SmartDeviceService")

// Create an app instance
const app = smarthome()


// Register handlers for Smart Home intents

app.onExecute(async (body, headers) => {
  console.log("onExecute call request Id " + body.requestId);
  console.log("body " + JSON.stringify(body));
  return await smartDeviceService.execute(body.requestId, body.inputs[0].payload);
})

app.onQuery(async (body, headers) => {
  console.log("onQuery call request Id " + body.requestId);
  console.log("body " + JSON.stringify(body));
  return await smartDeviceService.query(body.requestId, body.inputs[0].payload);
})

app.onSync(async (body, headers) => {
  console.log("onSync call");
  console.log("body.requestId ", body.requestId);
  return await smartDeviceService.sync(body.requestId);
})
module.exports = app;