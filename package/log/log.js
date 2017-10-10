(function () { 
	var obj =  function (exec) {
		this.write = function(file, contents) {
			return 'niu';
		};	
	};
	module.exports = obj;
})();
