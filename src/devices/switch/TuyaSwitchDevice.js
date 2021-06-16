const SwitchDevice = require("./SwitchDevice")

class TuyaSwitchDevice extends SwitchDevice {


    constructor(device) {
        super(device);       
    }
    getcommand() {
        return {
            cmd: "home/tuya/",
            stat: "stat/"

        }

    }
}

module.exports = TuyaSwitchDevice

