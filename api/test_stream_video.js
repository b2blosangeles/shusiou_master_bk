var fn = env.root_path + '/api/SampleVideo_1280x720_5mb.mp4';


/*
var video = req.param('video').split('|'), fn;
var folder_base = '/mnt/shusiou-video/youtube/';

var vid = video[0]; s =  (!video[1])?0:video[1];

var file_video = folder_base + vid + '/video/video.mp4';
*/
var folder_image = folder_base + vid + '/images/' +  vid;

fn = folder_image + '/180_' + s + '.png';
var CP = new pkg.crowdProcess();
res.send(fn);
return true;

var _f = {};
_f['S0'] = function(cbk) {
	pkg.fs.stat(file_video, function(err, stat) {
		 if(!err) {
			cbk(true);
		 } else {
			cbk(false);
			CP.exit = 1;
		}
	});	
};

_f['S1'] = function(cbk) {
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_image, function() {
		cbk(true);
	});
};

_f['S2'] = function(cbk) {
	pkg.fs.stat(fn, function(err, stat) {
		 if(!err) {
			cbk(fn);
		 } else {
			var childProcess = require('child_process');
			var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:180  -preset ultrafast ' +  fn +' -y ', 		   
				function (error, stdout, stderr) {
					cbk(true);
				});

		}
	});
};

CP.serial(
	_f,
	function(data) {	
		//	res.send(data);
		//	return true;		
		pkg.fs.stat(fn, function(err, data) {

		      if (err) {
			      res.send(fn + ' does not exist');
		      } else {
				var file = pkg.fs.createReadStream(fn);
				file.pipe(res);		      
			//	res.sendFile(fn);
			}
		});
	},
	6000
);

pkg.fs.stat(fn, function(err, data) {
    if (err) 
      res.redirect('http://api.shusiou.com'+req.url);
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
