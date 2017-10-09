var opt = req.param('opt');

var exec = require('child_process').exec;
exec('ls -l /tmp', function(error, stdout, stderr) {
   res.send(stdout);
});

//res.sendFile('/tmp/shusiou_git.log');
