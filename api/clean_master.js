var exec = require('child_process').exec;
var base = '/var/video/';
res.send('rm -fr ' + base );
return true;
exec('rm -fr ' + base, function(error, stdout, stderr) {
    res.send('rm -fr ' + base );
});
