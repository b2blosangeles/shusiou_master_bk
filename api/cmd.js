pkg.exec('cd ' + env.root_path + '&& git pull && ls -l', function(error, stdout, stderr) {
	 res.send(stdout);
});
