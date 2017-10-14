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
					me.read(p + key, function(data) {
						callback(data + '==cached==');
					});
				} else {
					me.read(fn, function(data) {
						me.folderP.build(p, function() {
							fs.readdir(p, function(err, files){
								for (var i = 0; i < files.length; i++) {
									fs.unlink( p + files[i]);
								 }								

								me.write(fn, data, function() {
									callback(data);
								});								
							});							
		
						});
					});
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
		this.write = function(fn, data, cbk) {	
			
			fs.writeFile(fn, data, function (err) {
				cbk();
			});
		}		    
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
