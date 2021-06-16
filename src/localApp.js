const express = require('express');
const morgan = require('morgan');
const devicesRoute =require("./routes/devices");

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/UI'));

//log all requests
morgan.token('headers', function (req) { return "headers -> " + JSON.stringify(req.headers) });
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":headers"'))

//console error logger
app.use(function (err, req, res, next) {
  console.error(err.stack);
  next(err);
})

//handler for all
app.use('/devices', devicesRoute);


module.exports =app;