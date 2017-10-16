var ytdl = require(env.root_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.root_path + '/api/inc/mysql/node_modules/mysql');

var uid = 1, 
    source = 'ytdl-core',
    code = 'https://youtu.be/WAXH_9bpLfI';

var CP = new pkg.crowdProcess();
var _f = {};

_f['P0'] = function(cbk) {
	var cfg0 = require(env.root_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	
	var str = 'SELECT * FROM `download_queue` WHERE `id` IN  (SELECT `id` FROM `download_queue`) ';
			//	'values ("' + source + '", "' + encodeURIComponent(code) + '", "' + uid + '", NOW(), 0 ); ';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
		} else {
			if (results.length) {
				cbk(results[0]);
			} else {
				cbk(false);
			}

		}
	});  
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
