const awsIot = require('aws-iot-device-sdk');
const path = require('path');
const { spawn } = require('child_process');

// device connection
var device = awsIot.device({
  keyPath: '/home/pi/certs/private.pem.key',
  certPath: '/home/pi/certs/device.pem.crt',
  caPath: '/home/pi/certs/Amazon-root-CA-1.pem',
  host: 'a3u6ue7vhjn9bm-ats.iot.us-west-2.amazonaws.com',
  clientId: 'SaltyDog-Policy'
});
// PH Sensor script
const sensor = spawn('python', ['-u', path.join(__dirname, '../Sensors/uart.py')]);

var message = '';
var topic = "topic_1";

// connect to sensor standard output
sensor.stdout.on('data', (data) => {
  // Coerce data to string segement
  message = data.toString().substring(6, 12); //6,11
  // Log to debug
  // console.log('data:', readings);
});  
// initial connection
device.on('connect', () => {
  console.log('connected');
  device.subscribe('topic_1');
  device.publish('topic_1', JSON.stringify({ test_data: 'Test Message Recieved'}));
  //timer_id();
});

//publish function
const publish = (topic,msg) => {
  console.log("publishing on:", topic,"message:",  msg);
  device.publish('topic_1', JSON.stringify({ value: msg }));
}

//publish every 5 secs
const publishTimer = () => {setInterval(() => { publish(topic, message) }, 1000) };

// run timer initially
publishTimer();

