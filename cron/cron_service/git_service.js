var exec = require('child_process').exec;
var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';

exec(cmd, function(error, stdout, stderr) {
  fs.appendFile("/tmp/shusiou_git.log", cmd + stdout, function(err) {
      if(err) {
      }
  });   
});
