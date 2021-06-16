const fullfilmentApp = require("./fullfilmentApp");
const localApp = require("./localApp");
const config = require('./config');


const fullfilmentPort = config.fullfilmentPort;
const localPort = config.localPort;

fullfilmentApp.listen(fullfilmentPort, () => {
    console.log('fullfilment app listening at http://localhost:${fullfilmentPort}');
});
localApp.listen(localPort, () => {
    console.log('local app listening at http://localhost:${localPort}');
});