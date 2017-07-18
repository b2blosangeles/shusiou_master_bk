/*
var spawn = require('child_process').spawn,

var exec = require('child_process').exec;
var base = '/var/video/';

exec('ls -l ' + base, function(error, stdout, stderr) {
    res.send('rm -fr A');
});
*/

var util  = require('util'),
    spawn = require('child_process').spawn,
    ls    = spawn('ls', ['-lh', '/usr']);
 
ls.stdout.on('data', function (data) {
  res.send('stdout: ' + data);
});
 
ls.stderr.on('data', function (data) {
  res.send('stderr: ' + data);
});
 
ls.on('exit', function (code) {
   res.send('child process exited with code ' + code);
});
