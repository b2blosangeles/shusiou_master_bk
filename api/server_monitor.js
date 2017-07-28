var base = '/var/video/',  base_ctl = '/var/video_ctl/';

pkg.fs.stat(base_ctl + 'pull_log.data', function(err, stats){
    if (err) {
	     res.send(err.message);
    } else {
	    var d = new Date(stats.mtime);
	    res.send(d);
    }    
});

/*
pkg.exec('git pull ' + env.root_path + '', function(error, stdout, stderr) {
	 res.send(stdout);
});
*/
