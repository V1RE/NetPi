const $ = require('jquery');
const express = require('express');
const formidable = require('formidable');
const moment = require('moment');
const player = require('play-sound')(opts = {});
const util  = require('util');
const path = require('path');
const fs = require('fs');
const request = require('request');
var app = express();

var now = moment();
var alarmtime = now;
var url = null;
var ytregexp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

app.use(express.static('public'));

app.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    var alarmvar = fields.alarm.toString();
    url = fields.url.toString();
    if (moment(alarmvar, "HH:mm").isValid()) {
      alarmtime = moment(alarmvar, "HH:mm");
      if (url.match(ytregexp)) {
		    downloadmp3(url);
      }
      res.end("Alarm set for: " + alarmtime.format("ddd @ HH:mm"));
      console.log(alarmtime - moment());
      setTimeout(function () {
        console.log("done");
        player.play('alarm.mp3', function (err) {
          player.play('backupalarm.mp3', function (err) {
            console.log("uh oh... we encountered an error :( \n" + err);
          });
        });
      }, alarmtime - moment());
    } else {
      res.end("ERROR, date provided is invalid!")
    }
  });
});


app.listen(3000, function () {
  console.log('App is running on port 3000');
});

function downloadmp3(yturl) {
  console.log("Downloading new alarm...");
	request.get('http://youtubeinmp3.com/fetch/?video=' + yturl).on('error', function (error) {
    console.log(error);
  }).pipe(fs.createWriteStream('alarm.mp3'));
  console.log('New alarm downloaded!');
}