var express = require('express');
var router = express.Router();

var os = require("os");
const db = require('../db');

var passlib = require("../password")

//Create function to get CPU information
function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

//Grab first CPU Measure
var startMeasure = cpuAverage();

//Set delay for second Measure
function GetCPUPercentage() { 

  //Grab second Measure
  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  //Output result to console
  return percentageCPU

}

var socket = require('../socketapi')

var count = 0
socket.io.on('connection', function(client) {
    count++;
    client.on('disconnect', function(){
        count--;
    })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dash', {
    "cpu": GetCPUPercentage(),
    "connected": count
  });
});

// https://quilljs.com/
// https://www.npmjs.com/package/quill-delta-to-html

module.exports = router;
