var exec = require('child_process').exec;
var path = require('path'), fs = require('fs');

var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var request = require(env.root_path + '/package/request/node_modules/request');

var folderP  = new FOLDERP ();
var base = '/var/video/';

var CP = new pkg.crowdProcess();
var _f = {};
var FOLDER_SCAN = function () {
	var me = this;
	this.total_size = 0;
	this.master_video = {};
	this._result = {};
	
	this.scan = function(dir, code, cbk) {
	    var finder = require(env.root_path + '/api/inc/findit/findit.js')(dir);			

	    finder.on('directory', function (dir, stat, stop) {
		var base = path.basename(dir);
		me.total_size += stat.size;
	    });
	    finder.on('file', function (file, stat) {
	       var filter_master = /\/video\/video\.mp4$/;
		var patt = new RegExp('^'+ dir);

	//       if (filter_master.test(file)) {
	//	  me.master_video = {folder:dir, code: code, master_video:file.replace(patt,''),  size:stat.size};
	 //      }  else {
		   me.total_size += stat.size;
		  me._result[file.replace(patt,'')] = stat.size;
	   //    }
	    });
	    finder.on('link', function (link, stat) { });

	    finder.on('end', function (link, stat) {

		if (typeof cbk == 'function') {
			me.master_video['totalsize'] = me.total_size;
			cbk({master:me.master_video, list:me._result});
		}
	    });


	};
};

_f['P0'] = function (cbk) {
	folderP.build(base, function() {
		cbk(true);
	});	
}
_f['P1'] = function (cbk) {	
	request({
	    url: 'http://api.shusiou.com/api/cloud_resource.report',
	    method: "GET"
	    }, function (error, resp, body) { 
	       cbk(JSON.parse(body));
	   });	
}
	
_f['P2'] = function (cbk) {
	var R = new FOLDER_SCAN();
	R.scan(base,  '', 
	function(data) {
		 cbk(data.list);
	}); 
}
function existFile(P1, fn) {
	for (o in P1) {
		for (o_1 in P1[o].list) {
			if (fn ==  (o + '/' + o_1)) return true	 	
		} 
	}
	return false;
}
CP.serial(
	_f,
	function(data) {
		var P1 = data.results.P1, P2 = data.results.P2, cg=[], rmv=[];	

		for (o in P1) {
			if ((P1[o].master.size) && (P1[o].master.size != P2[P1[o].master.master_video])) {
				cg[cg.length] = o  + '/video/video.mp4';
			}
			for (o_1 in P1[o].list) {
				if (P1[o].list[o_1] != P2[o + '/' + o_1]) {
					cg[cg.length] = P1[o].master.code  + '/' + o_1;	 
				}	
			} 
			 
		}	
		res.send(cg);
		return true;
		
		for (var o in P2) {
			if (!existFile(P1, o)) {
				rmv[rmv.length] = o;  
			}	
		}
		res.send(cg);
		return true;
		folderP.build(path.dirname(base + cg[0]), function() {
			
			var http = require('http');
			var fs = require('fs');
			var file = fs.createWriteStream(base + cg[0]);
			var request = http.get('http://api.shusiou.com/api/pipe_stream.js?fn='+cg[0], function(response) {
				response.pipe(file);
				response.on('end', function() {

					var CP1 = new pkg.crowdProcess();
					var _f1 = {};
					for (var j = 0; j < rmv.length; j++) {
						_f1['rmv_'+j] = (function(j) {
							return function(cbk) {
							//	exec('rm -fr ' + base + ' ' + rmv[j], function(error, stdout, stderr) {
									cbk('rm -fr ' + base + rmv[j]);

							//	});
							}
						})(j);
					}
					CP1.serial(
						_f1,
						function(data) {
							res.send({cg:cg,P2:P2});
						//	res.send(data.results);
						}
					);
				});
			});		
		});
	},
	30000
);
