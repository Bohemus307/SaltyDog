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
app.get("/data", (req, res, next)=>{ 
  //Here are the option object in which arguments can be passed for the python_test.js. 
  let options = { 
      mode: 'text', 
      pythonOptions: ['-u'], // get print results in real-time 
        // scriptPath: '/Sensors', //If you are having python_test.py script in same folder, then it's optional. 
  }; 
    
  PythonShell.run('/uart.py', options, function (err, result){ 
        if (err) throw err; 
        // result is an array consisting of messages collected  
        //during execution of script. 
        console.log('result: ', result.toString()); 
        res.send(result.toString()) 
  }); 
}); 

// app.use('/data', Router);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
