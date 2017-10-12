(function () {
	var obj =  function () {
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
