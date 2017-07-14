var exec = require('child_process').exec;
var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};

exec('cd ' + env.root_space + ' && git pull', function(error, stdout, stderr) {
//	cbk({stdout:stdout, stderr:stderr});
});
