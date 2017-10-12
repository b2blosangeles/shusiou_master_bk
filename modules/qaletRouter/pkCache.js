(function () {
	var obj =  function (fn) {
		this.read = function() {

		}		
		this.write = function() {

		}		    
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
