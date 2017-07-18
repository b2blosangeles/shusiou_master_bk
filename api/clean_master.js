var exec = require('child_process').exec;
var base = '/var/video/';

exec('ls -l ' + base, function(error, stdout, stderr) {
    res.send('rm -fr A' + base );
});
