const express = require('express');
const dummyAuthRoute = require("./routes/auth.js");
const smartHomeRoute = require("./routes/smarthome.js");
const morgan = require('morgan');


const app = express();
app.use(express.json());

//log all requests
morgan.token('headers', function (req) { return "headers -> " + JSON.stringify(req.headers) });
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":headers"'))

//console error logger
app.use(function (err, req, res, next) {
  console.error(err.stack);
  next(err);
})

//dummy auth for open id
app.use("/auth/", dummyAuthRoute);

//handler for fullfillment calls\intent from google
app.post('/fulfillment', smartHomeRoute);


module.exports =app;