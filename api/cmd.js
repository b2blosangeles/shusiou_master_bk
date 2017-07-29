pkg.exec('git pull ' + env.root_path, function(error, stdout, stderr) {
	 res.send(stdout);
});
