(function () {
	var obj =  function () {
		var folderP  = require(__dirname + '/folderP.js');
		this.folderP = new folderP();
		
		this.exist = function(fn) {
			return 'niu';
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
