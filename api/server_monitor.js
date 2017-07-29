var base = '/var/video/',  base_ctl = '/var/video_ctl/';

pkg.fs.stat(base_ctl + 'pull_log.data', function(err, stats){
    if (err) {
	     res.send(err.message);
    } else {
	    var td = new Date().getTime(), md = new Date(stats.mtime).getTime(), cd = new Date(stats.atime).getTime(),
		cv = td - cd, mv = td - md;
	    res.send(cv+'---'+mv);
	    return true;
	    
	    if (cv > 3600 * 24 * 1000) {
		pkg.exec('rm  '+ base_ctl + 'pull_log.data ' + base_ctl + 'rep_log.data', function(error, stdout, stderr) {
			res.send('clean daily');
		});		    
	    }	    
	    if (mv > 300000) {
		pkg.exec('git pull ' + env.root_path + '', function(error, stdout, stderr) {
			pkg.exec('shutdown -r +1', function(error, stdout, stderr) {
				 res.send('Server will be reboot in 1 minute!');
			});
		});		    
	    }
    }    
});
