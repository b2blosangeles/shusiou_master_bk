var exec = require('child_process').exec;
var exec1 = require('child_process').exec;

var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';
var e = exec(cmd, function(error, stdout, stderr) {
//  var l = stdout.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '\/$&').replace(/[\n\r]/g, '//n');
  var l = stdout.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '\\$&').replace(/[\n\r]/g, '\\n');
 // var log_str = "\n--- " + new Date().toString() + '   --c1c-' + "\n" + cmd + "==>\n" + stdout + '**' + l +  "***\n\n"; 
  var log_str1 = "sed -i '1s/^/-- git cron -c1c- " + new Date().toString() + '\\n' + l + "\\n/' /tmp/cron_git.log";
  
  fs.appendFile("/tmp/cron_git.log", ' ', function(err) {
    exec(log_str1, function(error, stdout, stderr) {});
  }); 
});
