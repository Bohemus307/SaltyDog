const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const config = require('../config.js');

//Import PythonShell module. 
const {PythonShell} =require('python-shell'); 

const app = express();


// const Router = require('./router/router.js');
const PORT = 3030;
app.use(express.static(path.join(__dirname, '/../Public')));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Router to handle the incoming request. 
app.get("/data", (req, res, next) => { 
    console.log('request made')
  // //Here are the option object in which arguments can be passed for the python_test.js. 
  // let options = { 
  //     mode: 'text', 
  //     pythonOptions: ['-u'], // get print results in real-time 
  //     scriptPath: path.join(__dirname, '../Raspberry-Pi-sample-code/'), //If you are having python_test.py script in same folder, then it's optional. 
  // }; 
  
  // PythonShell.run('uart.py', options, function (err, result){ 
  //       console.log('i began to run')
  //       if (err) throw err; 
  //       // result is an array consisting of messages collected  
  //       //during execution of script. 
  //       console.log('result: ', result.toString()); 
  //       res.send(result.toString()) 
  // }); 

let pyshell = new PythonShell(path.join(__dirname, '../Raspberry-Pi-sample-code/uart.py'));
 console.log('i ran in python shell')
// sends a message to the Python script via stdin
pyshell.send('Hello');
 
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});
 
// end the input stream and allow the process to exit
pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});
}); 

// app.use('/data', Router);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
