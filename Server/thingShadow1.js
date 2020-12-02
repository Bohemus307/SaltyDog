const awsIot = require('aws-iot-device-sdk'); 
const { exec, spawn, fork } = require('child_process');
const path = require('path');

// PH Sensor script
const sensor = spawn('python', ['-u', path.join(__dirname, '../Sensors/uart.py')]);

const NODE_ID = 'SaltyDog-Policy'; 
const INIT_DELAY = 15; 
const TAG = '[' + NODE_ID + '] >>>>>>>>> '; 

console.log(TAG, 'Connecting...'); 

var thingShadow = awsIot.thingShadow({ 
  keyPath: '/home/pi/certs/private.pem.key', 
  certPath: '/home/pi/certs/device.pem.crt', 
  caPath: '/home/pi/certs/Amazon-root-CA-1.pem', 
  clientId: NODE_ID, 
  host: 'a3u6ue7vhjn9bm-ats.iot.us-west-2.amazonaws.com', 
  port: 8883, 
  region: 'us-west-2', 
  debug: true, // optional to see logs on console 
}); 
 
thingShadow.on('connect', () => { 
  console.log(TAG, 'Connected.'); 
  thingShadow.register(NODE_ID, {}, () => { 
    console.log(TAG, 'Registered.'); 
    console.log(TAG, 'Reading data in ' + INIT_DELAY + ' seconds.'); 
    setTimeout(sendData, INIT_DELAY * 1000); // wait for `INIT_DELAY` seconds before reading the first record 
  }); 
}); 

var reading = "";
 // You can also use a variable to save the output 
 // for when the script closes later
sensor.stdout.on('data', function(data) {
    //Here is where the output goes
    //console.log('stdout: ' + data);
    reading = data.toString().substring(7, 12); //6,11
});

function sendData() { 
  
  var phSensor = { 
    "state": { 
      "desired": { reading },
    } 
  }; 
  
  console.log(TAG, 'Sending Data..', phSensor); 
 
  var clientTokenUpdate = thingShadow.update(NODE_ID, phSensor); 
  if (clientTokenUpdate === null) { 
    console.log(TAG, 'Shadow update failed, operation still in progress'); 
  } else { 
    console.log(TAG, 'Shadow update success.'); 
  } 
 
  // keep sending the data every 30 seconds 
  console.log(TAG, 'Reading data again in 30 seconds.'); 
  setTimeout(sendData, 5000); // 5000 ms => 5 seconds 
} 
 
thingShadow.on('status', function(thingName, stat, clientToken, stateObject) { 
  console.log('received ' + stat + ' on ' + thingName + ':', stateObject); 
}); 
 
thingShadow.on('delta', function(thingName, stateObject) { 
  console.log('received delta on ' + thingName + ':', stateObject); 
}); 
 
thingShadow.on('timeout', function(thingName, clientToken) { 
  console.log('received timeout on ' + thingName + ' with token:', clientToken); 
});


const closeSensor = () => {
  sensor.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  
    console.log('data:', readings);
  });
}

// closeSensor();

