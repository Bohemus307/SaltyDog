const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const config = require('../config.js');
const { exec, spawn, execFile } = require('child_process');

const app = express();

const PORT = 3030;
app.use(express.static(path.join(__dirname, '/../Public')));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


const readings = []; // Store readings


// Router to handle the incoming request. 
app.get("/data", (req, res, next) => { 
  console.log('request made')

  const sensor = spawn('python', ['-u', path.join(__dirname, '../Sensors/uart.py')]);

  sensor.stdout.on('data', function(data) {
      console.log('i ran');

      // Coerce Buffer object to Float
      readings.push(data.toString());
      // Log to debug
      console.log('data:', readings);
  });

  sensor.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(readings)
  });
  
}); 

// app.use('/data', Router);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
