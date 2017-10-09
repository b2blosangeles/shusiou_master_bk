var exec = require('child_process').exec;
var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};

var fs = require('fs');
exec('cd ' + env.root_space + ' && git pull', function(error, stdout, stderr) {
  fs.writeFile("/tmp/shusiou_git.log", "Hey there!", function(err) {
      if(err) {
      }
  });   
});
