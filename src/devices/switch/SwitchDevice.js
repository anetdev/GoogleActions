const utils = require("../../common/Utils");
var MqttService = require('../../services/MqttService');
class SwitchDevice {


    constructor(device) {
        this.device = device;
        this.deviceId = device.id;
        this.status = false;// on or off
        this.online = false;
        this.mqttClient = new MqttService();
        this.unreachable = false;
    }

    getcommand() {
        return {
            cmd: "cmnd/",
            stat: "stat/"

        }

    }
    //as soon as we inti check the status of the device
    async init() {
        await this.mqttClient.connect();
        let self = this;
        this.mqttClient.subscribe(this.getcommand().stat + this.deviceId + "/#", (topic, message) => {
            this.messageHandler(self, topic, message);
        });
        this.mqttClient.sendMessage(this.getcommand().cmd + this.deviceId + "/Power");
    }

    messageHandler(self, topic, message) {
        self.newMessage = true;
        self.unreachable = false;
        self.online = true;
        console.log(topic);
        console.log(message);
        switch (topic) {
            case self.getcommand().stat + self.deviceId + "/RESULT": {
                let result = JSON.parse(message);//{"POWER":"ON"}
                self.status = result.POWER == "ON"
                break;
            }
            case self.getcommand().stat + self.deviceId + "/POWER": {
                self.status = message == "ON" //message="ON"
                break;
            }

            default:
                break;
        }

    }

    async execute(params) {
        let results = [];
        console.log(params);
        for (const key in params) {
            const cmd = params[key]
            switch (cmd.command) {
                case 'action.devices.commands.OnOff':
                    {
                        let status = await this.handleOnOff(cmd.params);
                        results.push(status);
                        break;
                    }
                default:
                    break;
            }
        }

        return results.reduce((accumulator, currentValue) => {
            return { ...accumulator, ...currentValue };
        }, {});
    }
    getStatus() {
        if (this.unreachable) {
            return {
                errorCode: "deviceOffline",
                status: "ERROR"
            }
        }
        else {
            //query the stauts to get the correct status of the switch and populate online and on states
            return {
                status: "SUCCESS",
                online: this.online,
                on: this.status
            }
        }

    }

    async handleOnOff(params) {
        this.newMessage = null;
        const offlineMessage = {
            status: "ERROR",
            errorCode: "deviceTurnedOff",
            states: {
                online: this.online,
                on: this.status
            }
        };
        //mqtt send params to device
        //query the stauts to get the correct status of the switch and populate online and on states
        this.status = params.on;
        let result = {};
        try {
            this.mqttClient.sendMessage(this.getcommand().cmd + this.deviceId + "/Power", this.status ? "ON" : "OFF");

            //wait for 500ms (5 tries * 100 ms) to see a status message arrived and send that info
            console.log(`Start waiting for response ${Date.now()}`);
            await utils.waitFor(() => { return this.newMessage === true;});
            console.log(`End waiting for response ${Date.now()}`);

            if (this.newMessage) {
                result = {
                    status: "SUCCESS",
                    states: {
                        online: this.online,
                        on: this.status
                    }
                };
            }
            else {
                this.unreachable = true;
                this.online = false;
                result = offlineMessage;
            }


        } catch (error) {
            //return offline status
            this.unreachable = true;
            this.online = false;
            result = offlineMessage;
        }
        return result;
    }


}

module.exports = SwitchDevice

