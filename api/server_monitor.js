var base = '/var/video/',  base_ctl = '/var/video_ctl/';

pkg.fs.stat(base_ctl + 'pull_log.data', function(err, stats){
    if (err) {
	     res.send(err.message);
    } else {
	    var td = new Date().getTime(), md = new Date(stats.mtime).getTime(), cd = new Date(stats.atime).getTime(),
		cv = (td - cd) / (3600 * 24 * 1000), mv = td - md;

	    if (cv > (3600 * 24 * 1000)) {
		pkg.exec('rm  '+ base_ctl + 'pull_log.data ' + base_ctl + 'rep_log.data', function(error, stdout, stderr) {
			res.send('clean daily');
		});		    
	    } else if (mv > 300000) {
		pkg.exec('git pull ' + env.root_path + '', function(error, stdout, stderr) {
			pkg.exec('shutdown -r +1', function(error, stdout, stderr) {
				 res.send('Outof update! server will be reboot in 1 minute!');
			});
		});		    
	    } else {
	    	res.send('Nothing to update.')
	    }
    }    
});
