var exec = require('child_process').exec;
var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};
var Nedb = require(env.root_space + 'package/nedb/node_modules/nedb');
var request = require(env.root_space + 'package/request/node_modules/request');

var pkg = {
	crowdProcess:require(env.root_space + 'package/crowdProcess/crowdProcess'),
	request		:require(env.root_space + 'package/request/node_modules/request'),
	fs 			: require('fs'),
	Nedb 		: require(env.root_space + 'package/nedb/node_modules/nedb'),
	db 			: {
					post_cache 	: new Nedb({ filename:  env.root_space + '_db/post_cache.db', autoload: true }),
					get_cache 	: new Nedb({ filename:  env.root_space + '_db/get_cache.db', autoload: true }),
					auth	: new Nedb({ filename: env.root_space + '_db/auth.db', autoload: true }),
					vhost	: new Nedb({ filename: env.root_space + '_db/vhost.db', autoload: true }),
					git_log	: new Nedb({ filename: env.root_space + '_db/git_log.db', autoload: true })
				}
				
};
var time_code = (process.argv.slice(2)[0])?process.argv.slice(2)[0]:'30';
var q = [];
pkg.db.vhost.find({}).sort({ created: -1 }).exec(function (err, vhost) {
	var CP = new pkg.crowdProcess();
	
	var _f = {};			
			

	if (!err) {
		for (var i=0; i < vhost.length; i++) {
			
			_f['vhost_'+vhost[i]['name']] = (function(i) {
				return function(cbk) {
					var scheule = {};
					try {
						scheule = require(env.root_space + '_microservice/' + vhost[i]['name']+'/cronJob/schedule.json');
						for (var j=0; j < scheule[time_code].length; j++) {
							q[q.length] = scheule[time_code][j].protocol + '://' + vhost[i]['domain'] + '/api/' + scheule[time_code][j].api;
						}
					} catch (e) {}
					cbk(true);					
				}
			})(i);				
		}
	} 
	CP.serial(
		_f,
		function(data) {	
			var CP1 = new pkg.crowdProcess();
			var _f1 = {};
			for (var k = 0; k < q.length; k++) {	
				_f1[k] = (function(k) {
						var tm = new Date().toString() + ' - ';
						return function(cbk) {
							request(q[k], function(err, resp, body){
							   cbk(q[k]);
							}); 
						 }   
					})(k);			
			}
			CP1.parallel(
				_f1,
				function(data) {
				},
				59000
			);	
		},
		6000
	);	
	
	
});
