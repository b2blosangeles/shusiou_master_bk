var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var folderP  = new FOLDERP ();
var base = '/var/video/';
folderP.build(base, function() {
     res.send(base);
     
     var R = new FOLDER_SCAN();
     R.scan(base,  '', 
     function(data) {
         res.send(data);
     });     
     
/*    
    var http = require('http');
  var fs = require('fs');

  var file = fs.createWriteStream(base+'file.png');
  var request = http.get('http://api.shusiou.com/api/pipe_stream.js?video=962SfJ00tYM&fn=images/962SfJ00tYM/180_100.png', function(response) {
        response.pipe(file);
        response.on('end', function() {
          res.sendFile(base + 'file.png');
         // res.send('niu');
        });
  });
//   res.send('niuB');
 // res.sendFile(base + 'file.png');
 */
});

return true;

var request = require(env.root_path + '/package/request/node_modules/request');
request({
    url: 'http://api.shusiou.com/api/cloud_resource.report',
    method: "GET"
    }, function (error, resp, body) { 
      //  res.send(resp);
       res.send(JSON.parse(body).Z2SCXDw0pZ4);
   });


var FOLDER_SCAN = function () {
	var me = this;
	this.total_size = 0;
	this.master_video = {};
	this._result = {};
	this.last_file = '';
	this.mtime = '';
	
	this.scan = function(dir, code, cbk) {
	    var finder = require(env.space_path + '/api/inc/findit/findit.js')(dir);
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
		   if (!me.mtime) me.mtime = stat.mtime;
		   if (new Date(stat.mtime) > new Date(me.mtime)) {
		       me.mtime = stat.mtime;
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
