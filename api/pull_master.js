var path = require('path'), fs = require('fs');

var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var request = require(env.root_path + '/package/request/node_modules/request');

var folderP  = new FOLDERP ();
var base = '/var/video/',  base_ctl = '/var/video_ctl/'

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
		// --- node is different than master on this comment
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
		folderP.build(base_ctl, function() {
			cbk(true);
		});	
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
		if ((o + '/' + P1[o].master.master_video) == fn) return true;
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
			if ((P1[o].master.size) && (P1[o].master.size != P2[o + '/' + P1[o].master.master_video])) {
				cg[cg.length] = o  + '/video/video.mp4';
			} 
			for (o_1 in P1[o].list) {
				if (P1[o].list[o_1] != P2[o + '/' + o_1]) {
					cg[cg.length] = P1[o].master.code  + '/' + o_1;	 
				}	
			} 
			 
		}	
		for (var o in P2) {
			if (!existFile(P1, o)) {
				rmv[rmv.length] = o;  
			}	
		}
		
		var CP1 = new pkg.crowdProcess();
		var _f1 = {}, tm = new Date().getTime();

		for (var i = 0; i < rmv.length; i++) {
			_f1['rmv_'+i] = (function(i) {
				return function(cbk) {
					if (new Date().getTime() - tm > 20000) {
						cbk('stopped at ' + (new Date().getTime() - tm));
						CP1.exit = 1;
					} else {					
						pkg.exec('rm -fr ' + base + ' ' + rmv[i], function(error, stdout, stderr) {
							cbk('removed ' + base + rmv[i] + ' at: ' + (new Date().getTime() - tm) + ' ms');
						});
					}	
				}
			})(i);	
		}
	
		for (var i = 0; i < cg.length; i++) {
			_f1['b_'+i] = (function(i) {
				return function(cbk) {
					if (new Date().getTime() - tm > 20000) {
						cbk('stopped at ' + (new Date().getTime() - tm));
						CP1.exit = 1;
					} else {
						folderP.build(path.dirname(base + cg[i]), function() {
							var http = require('http');
							var file = pkg.fs.createWriteStream(base + cg[i]);
							var request = http.get('http://api.shusiou.com/api/pipe_stream.js?fn='+cg[i], function(response) {
								response.pipe(file);
								response.on('end', function() {
									cbk('pulled ' + cg[i] + ' at: ' + (new Date().getTime() - tm) + ' ms');	
								});
							});		
						});
					}	
				}
			})(i);	
		}
		
		CP1.serial(
			_f1,
			function(data) {
				res.send(data);
			},
			60000
		);	
		return true;
	},
	60000
);
