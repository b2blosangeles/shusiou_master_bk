var file_video = env.root_path + '/api/SampleVideo_1280x720_5mb.mp4';
var folder_image = 'tmp/images/';

var fn = 'tmp/images/1.png', s=100;
    
var CP = new pkg.crowdProcess();
//res.send(fn);
//return true;

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
	var folderP = require(env.root_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_image, function() {
		cbk(true);
	});
};

_f['S2'] = function(cbk) {
/*	pkg.fs.stat(fn, function(err, stat) {
		 if(!err) {
			cbk(fn);
		 } else {
*/		 
			var childProcess = require('child_process');
			var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:180  -preset ultrafast ' +  fn +' -y ', 		   
				function (error, stdout, stderr) {
					cbk(true);
				});
/*
		}
	});*/
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
