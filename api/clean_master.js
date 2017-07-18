var exec = require('child_process').exec;
var base = '/var/video/';

exec('ls -l ', function(error, stdout, stderr) {
    res.send('rm -fr A');
});
