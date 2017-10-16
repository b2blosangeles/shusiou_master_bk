var c_folder =  '/tmp/tmp_section/';
var s_file = env.root_path + '/api/SampleVideo_1280x720_5mb.mp4',  s = 1, l =  6;
var fn = c_folder + s + '_' + l + '.mp4';


		
res.send(s_fil);
			return true;

var childProcess = require('child_process');
var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) {
	var folderP = require(env.root_pat + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(c_folder, function() {
		cbk(c_folder);	
	});
	
};
_f['S1'] = function(cbk) {
	cbk(1);
	return true;
	pkg.fs.stat(fn, function(err, stat) {
		var ls = childProcess.exec('ffmpeg  -i ' + s_file + ' -ss '+ s + ' -t ' + l + ' -c copy ' + fn +' -y ', 		   
			function (error, stdout, stderr) {
				cbk(true);
			});
	});
}

CP.serial(
	_f,
	function(data) {
		
		
		
res.send(fn);
			return true;
		
		
		pkg.fs.stat(fn, function(err, data) {
			res.send('date');
			return true;
		    if (err) 
		      res.send('it does not exist');
		    else {
			      var total = data.size;
			      var range = req.headers.range;
			      if (range) {
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0]; var partialend;
					  partialend =  parts[1];
					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;
					var file = pkg.fs.createReadStream(fn, {start:start, end:end});

					res.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
						'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
				       file.pipe(res);
				} else {
					res.send('Need streaming player');
				}
			}
		});
	},
	30000
);
