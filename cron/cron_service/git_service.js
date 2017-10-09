var exec = require('child_process').exec;
var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';

exec(cmd, function(error, stdout, stderr) {
//  var log_str = "sed -i 'ls/^/--- " + new Date().toString() + '   ---' + "\n" + cmd + "==>\n" + stdout + "\n\n/' /tmp/cron_git.log";
  var log_str = "sed -i 'ls/^/--- " + new Date().toString()  + "----\n\n/' /tmp/cron_git.log";
  exec(log_str, function(error, stdout, stderr) {
    
  });  
 // fs.appendFile("/tmp/cron_git.log", log_str, function(err) {
 // });   
});
