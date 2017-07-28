var base = '/var/video/', base_ctl = '/var/video_ctl/';

pkg.exec('rm -fr ' + base_ctl, function(error, stdout, stderr) {
    pkg.exec('rm -fr ' + base, function(error, stdout, stderr) {
         res.send('rm  --- ' + base_ctl);
    });
});
