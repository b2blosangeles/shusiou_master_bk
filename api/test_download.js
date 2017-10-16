var ytdl = require(env.root_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.root_path + '/api/inc/mysql/node_modules/mysql');

//var video = ytdl(url, {range: {start:start, end:end}, quality:'18'});
var url = 'https://youtu.be/wLOl00FJMtc';
var video = ytdl(url, {quality:'18'});
video.pipe(pkg.fs.createWriteStream('/tmp/niu.mp4'));	

/*
video.on('data', function(info) {}); 
*/
video.on('end', function(info) {
	res.send('done!!');
});	
/*
video.on('error', function() {
	cbk({idx:c_m, status:9});
});			
*/
