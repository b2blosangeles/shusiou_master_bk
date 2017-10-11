var fn = '/var/log/cron_git.log';
pkg.fs.stat(fn, function(err, data) {
	if (err) {
		//      res.redirect('http://api.shusiou.com'+req.url);
		res.send('NO');
	} else {
		var readerStream = fs.createReadStream(fn);
		readerStream.pipe(res);
	}
});
