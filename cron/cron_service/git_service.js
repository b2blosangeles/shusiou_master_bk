var exec = require('child_process').exec;
var path = require('path'), fs = require('fs');
var env = {root_space:path.join(__dirname, '../../')};

var cmd = 'cd ' + env.root_space + ' && git pull';

exec(cmd, function(error, cmd + stdout, stderr) {
  fs.writeFile("/tmp/shusiou_git.log", stdout, function(err) {
      if(err) {
      }
  });   
});
