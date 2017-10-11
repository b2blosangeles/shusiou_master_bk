var fn = '/var/log/cron_git.log';
pkg.fs.stat(fn, function(err, data) {
	if (err) {
		//      res.redirect('http://api.shusiou.com'+req.url);
		res.send('NO');
	} else {
		var readerStream1 = pkg.fs.createReadStream(fn);
		var readerStream2 = pkg.fs.createReadStream(fn);
		readerStream1.on('end', function(){
       			 readerStream2.pipe(res, { end:false});
    		});
		readerStream2.on('end', function(){
			res.end("Thats all!");
		    });
		readerStream1.pipe(res, { end:false});
	}
});
