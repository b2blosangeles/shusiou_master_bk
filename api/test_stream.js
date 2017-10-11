var fn = '/var/log/cron_git.log';
pkg.fs.stat(fn, function(err, data) {
	if (err) {
		//      res.redirect('http://api.shusiou.com'+req.url);
		res.send('NO');
	} else {
		var readerStream1 = pkg.fs.createReadStream(fn);
		var readerStream2 = pkg.fs.createReadStream(fn);
		readerStream1.pipe(readerStream2);
		readerStream1.pipe(res);
	}
});
