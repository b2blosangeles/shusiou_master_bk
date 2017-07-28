var base = '/var/video/',  base_ctl = '/var/video_ctl/'

function checkPullLog(v, cbk) {
	pkg.fs.appendFile(base_ctl + 'pull_log.data', , function(err, stats){
	    res.send(stats);
	});
};

/*
pkg.exec('git pull ' + env.root_path + '', function(error, stdout, stderr) {
	 res.send(stdout);
});
*/
