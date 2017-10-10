(function () { 
	var obj =  function (exec) {
		this.write = function(file, contents) {
			var log_str1 = "sed -i '1s/^/=== git cron -c1c- " + new Date().toString() + '\\n' + 'l' + "===\\n\\n/' " + file;
			 exec(log_str1, function(error, stdout, stderr) {
		    		//   
		   	 });			
		};	
	};
	module.exports = obj;
})();
