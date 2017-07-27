pkg.exec('nodejs ' env.root_path + '/cron/cron_service/update_service.js', function(error, stdout, stderr) {
	 res.send(stdout);
});
