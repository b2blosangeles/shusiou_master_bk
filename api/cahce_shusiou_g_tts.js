var str = req.param('str'), lang = req.param('lang'), folder_base = '/tmp/shusiou_tts/';

if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}
var sh = require(env.space_path + '/api/inc/shorthash/shorthash.js');
var fn = folder_base + sh.unique(str+'_'+lang)+'.mp3';


var CP = new pkg.crowdProcess();

var _f = {};
_f['S1'] = function(cbk) {
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_base, function() {
		cbk(true);
	});
};

CP.serial(
	_f,
	function(data) {		
		pkg.fs.stat(fn, function(err, data) {
		    if (err) 
		      res.redirect('http://api.shusiou.com'+req.url);
		    else {
				res.send(fn);
			}
		});
	},
	6000
);
