var base = '/var/video/',  base_ctl = '/var/video_ctl/';
 res.send('stats');
return true;
pkg.fs.stat(base_ctl + 'pull_log.data', function(err, stats){
    if (err) {
	     res.send(err.message);
    } else {
	    res.send(stats);
    }    
});

/*
pkg.exec('git pull ' + env.root_path + '', function(error, stdout, stderr) {
	 res.send(stdout);
});
*/
