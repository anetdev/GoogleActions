var mqtt = require('mqtt');
const config = require('../config');
const utils = require("../common/Utils");

class MqttService {
  constructor() {
    this.mqttClient = null;
    this.host = config.mqtt_host;
    this.port = config.mqtt_port;
    this.username = config.mqtt_user
    this.password = config.mqtt_pass;
    this.instanceId = Math.random();
  }

  async connect() {

    let connected = null;

    console.log("instanceId " + this.instanceId);
    //connect to mqtt host
    this.mqttClient = mqtt.connect(this.host, { port: this.port, username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      connected = true;
      console.log('mqtt client connected');
    });

    this.mqttClient.on('close', () => {
      console.log('mqtt client disconnected');
    });
    console.log(`Start waiting to connect. Instance ->${this.instanceId} ${Date.now()}`);
    await utils.waitFor(() => { return connected === true; });
    console.log(`End waiting to connect. Instance ->${this.instanceId} ${Date.now()}`);
    return connected;
  }

  //subscribes to a topic. TODO: we can think of making this subscibe to a list of topics. 
  //param will be a dict. topics as keys and callback as values
  async subscribe(subscriptionTopic, callback) {
    console.log("instanceId " + this.instanceId);
    await this.reconnect();

    // subscribe if we have valid topic
    if (subscriptionTopic) {
      this.mqttClient.subscribe(subscriptionTopic, { qos: 0 });
    }

    // When a message arrives, console.log it and execute callback
    this.mqttClient.on('message', function (topic, message) {
      console.log(message.toString());
      callback(topic, message.toString());
    });
  }

  // Sends a mqtt message to topic
  async sendMessage(topic, message) {
    await this.reconnect();
    this.mqttClient.publish(topic, message);
  }

  async reconnect() {
    if (!this.mqttClient.connected) {
      console.error("Mqtt client not connected. retrying...");
      await this.connect();
      if (!this.mqttClient.connected) {
        console.error("Mqtt client still not connected. giving up...");
        throw new Error("Mqtt client not connected.");
      }
    }
  }
}

module.exports = MqttService;//we need a new instance per device.