// Import the appropriate service
const deviceService = require("../services/DevicesService");
const deviceHandler = require("../devices/DeviceTypeHandler");

class SmartDeviceService {
    constructor() {
        this.devices = deviceService.getDevices();
        this.init();
    }

    async init() {
        this.devices.forEach(d => {
            let handler = deviceHandler.getDeviceHandler(d.id);
            handler.init();
        });


    }

    async execute(requestId, payload) {
        let deviceHandlers = [];
        let devicesStatus = {};
        let payloadCmd = [];
        if (payload) {
            for (let cKey in payload.commands) {
                const command = payload.commands[cKey];
                command.devices.forEach(device => {
                    //find out the type of device and handle the corresponding command
                    let handler = deviceHandler.getDeviceHandler(device.id);
                    deviceHandlers.push(handler);
                });

                for (const key in deviceHandlers) {
                    const handler = deviceHandlers[key]
                    devicesStatus[handler.deviceId] = await handler.execute(command.execution);
                }


                let status = Object.values(devicesStatus).reduce((accumulator, currentValue) => {
                    return { ...accumulator, ...currentValue };
                }, {});

                payloadCmd.push({
                    ...{
                        ids: Object.keys(devicesStatus),
                    }, ...status
                });//we just need to pass one status object.
            }
        }
        let result = {
            requestId: requestId,
            payload: {
                commands: payloadCmd
            },
        }
        console.log("result " + JSON.stringify(result));
        return result
    }

    async query(requestId, payload) {
        let deviceHandlers = [];
        let devicesStatus = {};
        if (payload && payload.devices) {
            payload.devices.forEach(device => {
                //find out the type of device and handle the corresponding command
                let handler = deviceHandler.getDeviceHandler(device.id);
                deviceHandlers.push(handler);
            });

            for (const hkey in deviceHandlers) {
                const handler = deviceHandlers[hkey];
                devicesStatus[handler.deviceId] = await handler.getStatus();
            }
        }
        let result = {
            requestId: requestId,
            payload: {
                devices: devicesStatus
            },
        }
        console.log("result " + JSON.stringify(result));
        return result;
    }
    async sync(requestId) {
        //refresh
        this.devices=deviceService.getDevices();
        return new Promise(p => p({
            requestId: requestId,
            payload: {
                agentUserId: 'user-id',
                devices: this.devices,
            },
        }));
    }
}

module.exports = new SmartDeviceService();