const SerialPort = require('serialport')
const Raspi = require('raspi-io').RaspiIO;
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi({ enableSerial: true })
});

board.on('ready', () => {
  var sp = new SerialPort("/dev/ttyUSB0", {
    baudRate: 9600
  });

  sp.on("open", function() {
    console.log("Port is open!");

    // Once the port is open, you may read or write to it.
    sp.on("data", function(data) {
      console.log("Received: ", data);
    });

    setInterval(function(){ sp.write(new Buffer.from(["0120000003"])) }, 5000);
  });

});

