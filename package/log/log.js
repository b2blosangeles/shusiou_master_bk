(function () { 
	var obj =  function () {
		var fs = require('fs'), exec = require('child_process').exec;
		this.write = function(file, contents) {
			var l =  contents.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '\\$&').
				replace(/[\n\r]/g, '\\n\\n');
			var log_str1 = "sed -i '1s/^/=== git cron " + new Date().toString() + '\\n' + l + "===\\n\\n/' " + file;
  			fs.appendFile(file, ' ', function(err) {
				exec(log_str1, function(error, stdout, stderr) {});
  			});			
			
		};	
	};
	module.exports = obj;
})();
