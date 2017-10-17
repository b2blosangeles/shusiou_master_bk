var ytdl = require(env.root_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.root_path + '/api/inc/mysql/node_modules/mysql');

function getServerIP() {
    var ifaces = require('os').networkInterfaces(), address=[];
    for (var dev in ifaces) {
        var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
        for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
    }
    return address;
};

var holder_ip = getServerIP();

var CP = new pkg.crowdProcess();
var _f = {};

_f['P0'] = function(cbk) {
	var cfg0 = require(env.root_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE `download_queue` SET `status` = 9 WHERE `holder_ip` = "' + holder_ip + '" AND `status` <> 0';
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
_f['P1'] = function(cbk) {
	var cfg0 = require(env.root_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'UPDATE  download_queue SET `holder_ip` = "' + holder_ip + '", `status` = 1, hold_time = NOW() ' + 
		' WHERE  `status` = 0 AND `holder_ip` = "" OR `holder_ip` IS NULL ORDER BY `created` ASC LIMIT 1';
	
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
_f['P2'] = function(cbk) {
	var cfg0 = require(env.root_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();
	var str = 'SELECT * FROM `download_queue` WHERE `holder_ip` = "' + holder_ip + '" AND `status` = 1';
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

_f['D0'] = function(cbk) {
	if ((CP.data.P2) && (CP.data.P2.code)) {
		// var url = decodeURIComponent(CP.data.P2.code);
		var url = CP.data.P2.code;
		var video = ytdl(url, {quality:'18'}, function(err) {
			if (err) {
				cbk('err');
			}
		});
		video.pipe(pkg.fs.createWriteStream('/tmp/niu.mp4'));	


		video.on('data', function(info) {
		//	total += info.length;
		//	t[t.length] = info.length;
		//	s++;
		}); 

		video.on('end', function(info) {
			cbk('CP.data.P2.code');
		});
		
		video.on('err', function(info) {
			cbk('ERRCP.data.P2.code');
		});		
		
	} else {
		cbk(false);
	}	
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	59000
);
