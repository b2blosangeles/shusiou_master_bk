var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var request = require(env.root_path + '/package/request/node_modules/request');

var folderP  = new FOLDERP ();
var base = '/var/video/';

var CP = new pkg.crowdProcess();
var _f = {};

_f['P1'] = function (cbk) {	
	request({
	    url: 'http://api.shusiou.com/api/cloud_resource.report',
	    method: "GET"
	    }, function (error, resp, body) { 
	       cbk(JSON.parse(body));
	   });	
},
_f['P2'] = function (cbk) {	
	var R = new FOLDER_SCAN();
	R.scan(base,  '', 
	function(data) {
		 cbk(data);
	}); 
}
CP.serial(
	_f,
	function(data) {
		res.send({P1:data.results.P1, P2:data.results.P2});
	},
	30000
);	

