(function () {
	var obj =  function (root_path) {
		var folderP  = require(__dirname + '/folderP.js');
		var fs = require('fs');
		this.folderP = new folderP();
		
		this.exist = function(fn, key, callback) {
			var me = this;
			var patt = new RegExp('^' + root_path + '/files/');
			var p = '/tmp/cache/'+ fn.replace(patt, '').replace(/\//g, '_')+'/';
			fs.exists(p + key, function(exists){
				if(exists){
					callback('Yes');
				} else {
					//me.folderP.build(p, function() {
						me.read(fn, callback)
					//});
				}
			});
		}		
		this.read = function(fn, cbk) {
			fs.readFile(fn,'utf8', function (err,data) {
				if (!err) {
					cbk(data);
				} else {
					cbk('');
				}
			});
		}		
		this.write = function() {

		}		    
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
