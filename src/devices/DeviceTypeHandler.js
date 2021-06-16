const deviceService = require("../services/DevicesService");
const SwitchDevice = require("./switch/SwitchDevice")
const TuyaSwitchDevice = require("./switch/TuyaSwitchDevice")

class DeviceTypeHandler {
    constructor() {
        this.handlers = {};
        this.devices = deviceService.getDevices();
    }

    getDeviceHandler(deviceId) {
        if (!(deviceId in this.handlers)) {

            let device = this.devices.find(d => d.id == deviceId);
            switch (device.type) {
                case 'action.devices.types.SWITCH':
                    {
                        this.handlers[deviceId] = this.getSwitchDevice(device);
                        break;
                    }

                default:
                    break;
            }
        }
        return this.handlers[deviceId];
    }
    getSwitchDevice(device) {

        let d = {};
        switch (device.deviceInfo.manufacturer) {
            case 'Esp Relay':
                {
                    d = new SwitchDevice(device);
                    break;
                }
            case 'tuya':
                {
                    d = new TuyaSwitchDevice(device);
                    break;
                }

            default:
                break;
        }
        return d;
    }
}

module.exports = new DeviceTypeHandler();

