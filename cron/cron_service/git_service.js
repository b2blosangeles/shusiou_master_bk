var exec = require('child_process').exec;
var exec1 = require('child_process').exec;

var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';

exec(cmd, function(error, stdout, stderr) {
  var log_str = "--- " + new Date().toString() + '   ---' + "\n" + cmd + "==>\n" + stdout + "\n\n";
  fs.appendFile("/tmp/cron_git.log", log_str, function(err) {
    var log_a = log_str.split("\n");
    var l = log_a.join("\\n")
    
    var log_str1 = "sed -i '1s/^/task goes heren/' /tmp/cron_git.log";
    exec1(log_str1, function(error, stdout, stderr) {

    });
    
  }); 
  
});
