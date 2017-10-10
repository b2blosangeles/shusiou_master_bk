var exec = require('child_process').exec;
var exec1 = require('child_process').exec;

var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';

exec(cmd, function(error, stdout, stderr) {
  var log_str = "--- " + new Date().toString() + '   ---' + "\n" + cmd + "==>\n" + stdout + "\n\n";
  fs.writeFile("/tmp/tmp_cron_git.log", log_str, function(err) {
    var log_str1 = 'cat /tmp/tmp_cron_git.log /tmp/cron_git.log > /tmp/cron_git.log';
    exec1(log_str1, function(error, stdout, stderr) {

    });     
  }); 
  
});
