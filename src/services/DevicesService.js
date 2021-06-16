const path = require('path');
const fs = require("fs");
class DevicesService {
    constructor() { }

    getDevicesJSONPath() {
        return path.resolve(__dirname, "../devices/devices.json");
    }
    getDevices() {
        let data = fs.readFileSync(this.getDevicesJSONPath());
        return JSON.parse(data.toString());
    }
    async updateDevicesData(newPath) {
        let backupFolder = path.resolve(__dirname, "../devices/backup");
        //backup and update

        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder);

        }
        let newName = `devices-${Date.now()}.json`;
        await fs.promises.rename(this.getDevicesJSONPath(), path.join(backupFolder, newName), (error) => { console.error(error); });
        await fs.promises.rename(newPath, this.getDevicesJSONPath(), (error) => { console.error(error); });
    }
}
module.exports = new DevicesService;