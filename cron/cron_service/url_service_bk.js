var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};
var request = require(env.root_space + 'package/request/node_modules/request');
var crowdProcess = require(env.root_space + 'package/crowdProcess/crowdProcess');

var Nedb = require(env.root_space + 'package/nedb/node_modules/nedb');

var db = new Nedb({ filename:  env.root_space + '_db/url_cron.db', autoload: true });
var CP = new crowdProcess();

var schedule = (process.argv.slice(2)[0])?process.argv.slice(2)[0]:'30';
db.find({schedule:schedule}).exec(function (err, list) {
	 if (err) {
		console.log(err.message);
	 } else {
		var _f = {};
		for (var i = 0; i < list.length; i++) {	
			_f[i] = (function(i) {
						var tm = new Date().toString() + ' - ';
						return function(cbk) {
							request(list[i].url, function(err, resp, body){
							   console.log(tm + ':-U-:' + list[i].url + ':-S-:' + list[i].schedule + ':: return => ' + new Date().toString() + '::' );
							}); 
							cbk(tm + ':-U-:' + list[i].url + ':-S-:' + list[i].schedule + '');
						 }   
					})(i);
		}		
		
		CP.serial(
			_f,
			function(data) {
				console.log(data);
			},
			59000
		);
	 }

});