var str = req.param('str'), lang = req.param('lang'), folder_base = '/tmp/shusiou_tts/';

if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}

var sh = require(env.root_path  + '/api/inc/shorthash/shorthash.js');
var fn = folder_base + sh.unique(str+'_'+lang)+'.mp3';


var CP = new pkg.crowdProcess();

var _f = {};
_f['S1'] = function(cbk) {
	var folderP = require(env.root_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_base, function() {
		cbk(true);
	});
};

CP.serial(
	_f,
	function(data) {		
		pkg.fs.stat(fn, function(err, data) {
		    if (true) {
			 var options = {
			      url: 'http://api.shusiou.com'+req.url,
			      headers: {
				 'Referer': 'http://translate.google.com/',
				 'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
			      }
			   }
			   var p = pkg.request(options);
			      p.pipe(pkg.fs.createWriteStream(fn));
			      p.pipe(res);
		    } else {
				res.send(fn);
			}
		});
	},
	6000
);
