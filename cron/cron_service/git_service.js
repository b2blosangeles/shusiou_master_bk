var exec = require('child_process').exec;
var exec1 = require('child_process').exec;

var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';
exec(cmd, function(error, stdout, stderr) {
  var l = stdout.replace(/[\n\r]/g, 'FFF').replace(/\r/ig, 'RR');
  var log_str = "\n--- " + new Date().toString() + '   --c1c-' + "\n" + cmd + "==>\n" + stdout + '**' + l +  "\n\n";
  
  fs.appendFile("/tmp/cron_git.log", log_str, function(err) {
    var log_str1 = "sed -i '1s/^/-- git cron -c1c- " + new Date().toString() + '\\n' + l + "\\n/' /tmp/cron_git.log";
    exec1(log_str1, function(error, stdout, stderr) {});
  }); 
});
