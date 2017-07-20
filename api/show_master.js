var path = require('path'), fs = require('fs');

var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var request = require(env.root_path + '/package/request/node_modules/request');

var folderP  = new FOLDERP ();
var base = '/var/video/';

var CP = new pkg.crowdProcess();
var _f = {};

function getServerIP() {
    var ifaces = require('os').networkInterfaces(), address=[];
    for (var dev in ifaces) {
        var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
        for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
    }
    return address;
};


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
		cbk(true);
	});	
}

_f['P1'] = function (cbk) {	
    request({
        url: 'http://api.shusiou.com/api/cloud_resource.report',
        method: "POST",
        headers: {
		    "content-type": "application/json",
		    },
        	json: {ip:getServerIP()}
        }, function (error, resp, body) { 
	    cbk(body);
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


function lastUpdate(P1) {
	var lastone = 0;
	for (o in P1) {
		if (P1[o].master.lastupdate > lastone) lastone = P1[o].master.lastupdate;
	}
	return lastone;
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
		res.send({rmv:rmv, cg:cg, lastupdate:lastUpdate(P1), P1:P1})	
		return true;
	},
	30000
);
