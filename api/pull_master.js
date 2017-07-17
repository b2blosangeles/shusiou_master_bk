var exec = require('child_process').exec;
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
	this.last_file = '';
	this.mtime = '';
	
	this.scan = function(dir, code, cbk) {
	    var finder = require(env.root_path + '/api/inc/findit/findit.js')(dir);			
	    var path = require('path');

	    finder.on('directory', function (dir, stat, stop) {
		var base = path.basename(dir);
		me.total_size += stat.size;
	    });
	    finder.on('file', function (file, stat) {
	       var filter_master = /\/video\/video\.mp4$/;
		var patt = new RegExp('^'+ dir);

	       if (filter_master.test(file)) {
		  me.master_video = {folder:dir, code: code, master_video:file.replace(patt,''), mtime:stat.mtime, size:stat.size};
	       }  else {
		   me.total_size += stat.size;
		  // if (!me.mtime) me.mtime = stat.mtime;
		   if (new Date(stat.mtime) > new Date(me.mtime)) {
		  //     me.mtime = stat.mtime;
		       me.last_file = file.replace(patt,'');
		   }
		  me._result[file.replace(patt,'')] = {mtime:stat.mtime, size:stat.size};
	       }
	    });
	    finder.on('link', function (link, stat) { });

	    finder.on('end', function (link, stat) {

		if (typeof cbk == 'function') {
			me.master_video['totalsize'] = me.total_size;
			cbk({master:me.master_video, laster_file:{file:me.last_file, mtime:me.mtime}, list:me._result});
		}
	    });


	};
};



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
		 cbk(data.list);
	}); 
}
CP.serial(
	_f,
	function(data) {
		var P1 = data.results.P1, P2 = data.results.P2, cg=[], rmv=[];
		
		for (o in P1) {
			for (o_1 in P1[o].list) {
				 P1[o].list[o_1]['path'] = P1[o].master.folder + o_1;
				 cg[cg.length] = P1[o].list[o_1];
			}    
		}
		for (o in P2) {
			for (o_1 in P2[o].list) {
				 P2[o].list[o_1]['path'] = '' + o + '/' + o_1;
				 rmv[cg.length] = P2[o].list[o_1];
			}    
		}
		res.send({cg:cg, rm:rmv});
	//	res.send({rm:rmv});
		return true;
		var CP1 = new pkg.crowdProcess();
		var _f1 = {};
		for (var j = 0; j < rm.length; j++) {
			_f1['rmv_'+j] = (function(j) {
				return function(cbk) {
					cbk(rmv[j]);
				}
			})(j);
		}
		CP1.serial(
			_f1,
			function(data) {
				res.send(data.results);
			}
		);	
		
		//exec('rm -fr ' + base + ' ' + rm[0], function(error, stdout, stderr) {
			// res.send('rm -fr ' + base + rm[0]);
			
		//});
	},
	30000
);	

