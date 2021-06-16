const express = require('express');
const path = require('path');
const formidable = require('formidable');
const deviceService = require("../services/DevicesService");


const router = express.Router();

router.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, "../UI/views/devices.html",));

});
router.get('/data', (request, response) => {
    var d = deviceService.getDevices();
    return response.json(d);
});
router.post('/', (request, response) => {
    var form = new formidable.IncomingForm();
    form.parse(request, async (err, fields, files) => {
        await deviceService.updateDevicesData(files.file.path);
        var d = deviceService.getDevices();
        return response.json(d);
    });
});
module.exports = router;