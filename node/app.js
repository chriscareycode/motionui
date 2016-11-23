'use strict';
/*
 * TODO:
 * - Add a settings file and move the username password for Nagios in there.
 *
 */

//=============================================================================
// Requires
//=============================================================================

var express = require('express');
var app = express();
var cors = require('cors');
var http = require('http');
var url = require('url');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

var port = 4300;

// //=============================================================================
// // Settings
// //=============================================================================

// var settings;

// // Load the settings file, if it exists
// try {
//   stats = fs.lstatSync('settings.js');
//   settings = require('./settings');
//   if (stats.isFile()) { console.log('settings.js file found.'); }
// }
// catch (e) {
//   console.log('Copy the file settings.dist.js to settings.js');
//   process.exit();
// }

// // Check if the user changed the username and password in settings.js
// if (settings.username === 'changeme') {
//   console.log('Please set username and password for Nagios web interface in settings.js');
//   process.exit();
// }

// //=============================================================================
// // Private Functions
// //=============================================================================

// function getNagios(req, res) {

//   //var username = settings.username;
//   //var password = settings.password;

//   //var auth = 'Basic ' + new Buffer(settings.username + ':' + settings.password).toString('base64');
//   var page = req.params.page;
//   var url_parts = url.parse(req.url, true);
//   var queryparams = url_parts.query;

//   // console.log('req.url');
//   // console.log(req.url);

//   // console.log('url_parts');
//   // console.log(url_parts);

//   // console.log('params');
//   // console.log(req.params);

//   // console.log('queryparams');
//   // console.log(queryparams);

//   var path = '/nagios/cgi-bin/'+page+url_parts.search;

//   var options = {
//     host: settings.nagiosServerHost,
//     port: 80,
//     path: path
//   };

//   // add auth to the payload if settings.auth === true
//   if (settings.auth) { options.auth = settings.username+':'+settings.password; }

//   console.log('requesting URL ' + options.host + ':' + options.port + options.path);

//   http.get(options, function(resp){
//     //resp.setEncoding('utf8');
//     var body = '';

//     resp.on('data', function(chunk){
//       body += chunk;
//     });
//     resp.on('end', function(){
//       //do something with chunk
//       if (body === '') {
//           console.log('body is empty. sending default');
//           //res.redirect('/images/broken-image.gif');
//           return;
//       }
//       res.setHeader('Content-Type', 'application/json');
//       res.send(body);
//     });
//   }).on("error", function(e){
//     console.log("Got error: " + e.message);
//     res.send('Got error: ' + e.message);
//   }).end();

//   return;
// }

// //=============================================================================
// // loadSettings and saveSettings
// //=============================================================================

// function loadSettings(req, res) {
//   console.log('loadSettings');
//   //console.log(req);
//   const settingsNoPassword = {};
//   for (var s in settings) {
//     if (s !== 'password') {
//       settingsNoPassword[s] = settings[s];
//     }
//   }
//   res.send(settingsNoPassword);
// }

// function saveSettings(req, res) {
//   console.log('saveSettings');
//   console.log(req.body);

//   var text = 'module.exports = ' + JSON.stringify(req.body, null, "\t");

//   fs.writeFile('settings-json.js', text, function(err) {
//     if(err) {

//       res.send({
//         success: false,
//         successMessage: 'Failure writing to file.'
//       });

//       return console.log(err);
//     }
//     console.log("The file was saved!");

//     res.send({
//       success: true,
//       successMessage: 'Thanks for the settings.'
//     });

//   });


// }

var motionDir = '/home/pi/motion/';

var doDelete = function(req, res) {
  //var file = req.params.file;
  var file = req.body.file;
  console.log('delete files ' + file + '*');

  glob.glob(motionDir + file + "*", function (er, files) {
    files.forEach(function(e) {
      console.log('delete glob ' + e);
      fs.unlink(e,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully: ' + e);
      });
    });
    res.json({ success: true, message: 'Deleting files', files: files });
  });
};

var doSave = function(req, res) {
  //var file = req.params.file;
  var fileToSave = req.body.file;
  console.log('save files ' + fileToSave + '*');

  glob.glob(motionDir + fileToSave + "*", function (er, files) {
    files.forEach(function(e) {
      console.log('move glob ' + e);
      let filename = e.split("/").pop();
      fs.rename(e, motionDir + 'save/' + filename);
    });
    res.json({ success: true, message: 'Saved files', files: files });
  });
};

//=============================================================================
// Set up routes
//=============================================================================

app.use(cors());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//express.mime.type['ogv'] = 'video/ogg';
express.static.mime.define({
  'video/ogg': ['ogv'],
});

app.use('/', express.static('../dist'));
// app.get('/', function(req, res) {
//   res.send('hello ' + new Date());
// });

// TODO
// delete file(s)
app.get('/api/motion/command/:camera/*', function(req, res) {
  console.log('got GET /api/motion/command/:camera/*');
  const commands = req.url.split('/').slice(5);
  const command = commands.join('/');
  console.log(req.url);
  console.log(commands);
  console.log(command);

  const camera = req.params.camera;

  // talk to the camera
  const url ='http://' + camera + ':8080/' + command;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('node got response');
      console.log(body); // Show the HTML for the Google homepage.

      res.json({
        success: true,
        successMessage: 'remote command success',
        camera: camera,
        commands: commands,
        body: body
      });
    } else {
      res.json({
        success: false,
        successMessage: 'remote command failure',
        camera: camera,
        commands: commands,
        body: body
      });
    }
  });

  console.log(camera);
});

app.post('/api/motion/command/:camera/*', function(req, res) {
  console.log('got POST /api/motion/command/:camera/*');
  //const commands = req.url.split('/').slice(5);
  //const command = commands.join('/');
  //console.log(req.url);
  //console.log(commands);
  //console.log(command);
  console.log('request body');
  console.log(req.body);
});

app.use('/raw-motion-files', express.static(motionDir));

app.get('/api/files/list', function(req, res) {

  fs.readdir(motionDir, function (err, files) {
    // "files" is an Array with files names

    //res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      successMessage: '',
      files: files
    });

  }, function(err) {
    //res.setHeader('Content-Type', 'application/json');
    res.json({
      success: false,
      successMessage: 'Failed'
    });
  });

});

app.post('/api/delete', function(req, res) {
   doDelete(req, res);
});

app.post('/api/save', function(req, res) {
   doSave(req, res);
});

// app.get('/nagios/:page', function(req, res) {
//    getNagios(req, res);
// });



// TODO: serve catch-all to the index file


app.get('*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../dist') });
});


app.listen(port);

console.log('Listening on port ' + port + '...');
