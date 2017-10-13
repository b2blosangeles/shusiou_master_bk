(function () {
	var obj =  function (root_path) {
		var folderP  = require(__dirname + '/folderP.js');
		var fs = require('fs');
		this.folderP = new folderP();
		
		this.exist = function(fn, key, callback) {
			var patt = new RegExp('^' + root_path + '/files/');
			var filename = fn.replace(patt, '').replace(/\//g, '_')+'/'+key
			fs.exists(filename,function(exists){
				if(exists){
					callback('Yes');
				} else {
					callback('no');
				}
			);
		}		
		this.read = function() {

		}		
		this.write = function() {

		}		    
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
