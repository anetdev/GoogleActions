**Detailed steps** 🠊 https://blog.hashdebug.com/google-actions-mqtt-p1/


**Code Structure**

* index.js has the startup code. It launches two express apps on port 3000 and 3005 as defined in .env file
* fullfilmentApp.js has the express app to listen to google fulfilment posts. It also has the code to route authentication
* routes/smarthome.js uses the actions-on-google npm package to implement the sync, query, execute and disconnect callbacks.
* routes/auth.js implements the dummy auth. Since I am the only user and not publishing google actions project I didn't implement OAuth 2. Here we have a GET for the authorize call and POST of token. The authorize * is called when we link our smart device project with google assistant. Token call happens frequently to get the auth token to be used for sync. query and execute calls.
* routes/devices.js handles updates to the devices list via another express instance.
services folder contains service implementation for mqtt and mqtt device handling.
* /devices/devices.json has the definition of all our devices. This is JSON array containing device ids and other device properties.

**Setup**

Lets first clone the repo

```bash
git clone https://github.com/aNetdev/GoogleAction
cd GoogleActions
```
We now has to change a few of the env variables like setting the mqtt broker name. Open .env and update the MQTT_HOST.
[!image](https://blog.hashdebug.com/content/images/2021/06/image-3.png)

lets now look at the devices.json. Here is where we configure our devices. The main thing to remember here is the id. This is how each devices would be identified my google intents and mqtt messages. Id should be the same was the mqtt topic we configured in tasmota.
[!image](https://blog.hashdebug.com/content/images/2021/06/image-5.png)

The type identifies the type of device, here in our case ESP relay would act as a simple switch. The traits identifies which actions the device supports. We are only supporting on/off.
```json
[  
  {
    "id": "BedRoom2Fan",
    "type": "action.devices.types.SWITCH",
    "traits": ["action.devices.traits.OnOff"],
    "name": {
      "name": "Not Used"
    },
    "willReportState": true,
    "deviceInfo": {
      "manufacturer": "Esp Relay",
      "model": "esprelayV4",
      "hwVersion": "4",
      "swVersion": "9.4"
    }
  },
  ...
```
This node.js app is set to run as a docker image. So first we have to build it. Here is the command to build.
```bash
user@xyz:~/Work/Nodejs/MQTTRelay$ docker build -t mqttrelay .
```
and once we get the successfully built message we are done with the docker build.
```bash
......
Successfully built 6c13f8367389
Successfully tagged mqttrelay:latest
```
Next step deploy this docker image. We need to expose two ports 3000 and 3005.
```bash
docker run -p 3000:3000 -p 3005:3000 --name mqttrelayapp -d mqttrelay:latest
```
Once the docker image is up and running we see mqtt connection messages in the logs. I use portainer to manage my docker images.

![image](https://blog.hashdebug.com/content/images/2021/06/image-4.png)

We can now try and see if the express webserver is running by going to http://192.168.1.xx:3000/auth/authoriz and we should see this page.
192.168.1.xx is my docker host.
![image](https://blog.hashdebug.com/content/images/2021/06/image-6.png)

**Test our container**

It is now time to expose our url to the internet so that google can access the urls (fulfillment, auth and token). I use the awesome Nginx Proxy Manager docker image to manage certificates and map my domain name. Exposing the url to the internet is outside the scope of this article and has risks, so I am skipping that section. There are so many articles which would help us do that.

Next step is provide the urls in the google actions console. Lets say the domain we set up is google.myawesomedomain.com, the urls would look like this

Fulfillment url 🠊 https://google.myawesomedomain.com/fulfillment
Authorization url 🠊 https://google.myawesomedomain.com/auth/authoriz
Token url 🠊 https://google.myawesomedomain.com/auth/token

Fulfillment url
![image](https://blog.hashdebug.com/content/images/size/w1000/2021/06/image-7.png)
For OAuth the client id and client secret can be anything since we are not validating those in our code. If you want you can do that in /routes/auth.js router.get('/authoriz' and router.post('/token' handlers.


OAuth urls
![image](https://blog.hashdebug.com/content/images/2021/06/image-8.png)

The next thing to do is click on test and "Talk to AppName" so that google can do its magic and activate this project. We would get an error but that can be ignored.
![image](https://blog.hashdebug.com/content/images/size/w1000/2021/06/image-19.png)

