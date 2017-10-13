(function (space_root) {
	var obj =  function () {
		var folderP  = require(__dirname + '/folderP.js');
		var fs = require('fs');
		this.folderP = new folderP();
		
		this.exist = function(fn) {
			var patt = new RegExp('^' + space_root);
			return space_root
			//fn.replace(patt, '==');
		}		
		this.read = function() {

		}		
		this.write = function() {

		}		    
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})(space_root);
