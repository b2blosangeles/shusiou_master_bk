var base = '/var/video/';

pkg.exec('rm -fr ' + base, function(error, stdout, stderr) {
    res.send('rm -fr A ' + base);
});
