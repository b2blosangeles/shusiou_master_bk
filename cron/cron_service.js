var CronJobManager = require('./crontab_manager.js');
var manager = new CronJobManager();
var exec = require('child_process').exec;
var fs    = require('fs'), path = require('path')
var cron = require('./cron.json');
console.log(__dirname + "===");
fs.exists('./cron.json',function(exists){
  // handle result
});
/*
for (var i = 0; i < cron.length; i++) {
	var f = function(v) {
		return function() {
			exec('cd ' + __dirname + '/site/cron &&  ' + v.script, function(error, stdout, stderr) {
				if (!stderr) {
					console.log(JSON.stringify({status:'success', id:v.id, message:stdout}));
				} else {
					console.log(JSON.stringify({status:'error', id:v.id, message:stderr}));
				}
			});
			
		}
	};
	if (manager.exists( cron[i]['id'])) {
		manager.stop( cron[i]['id']);
	}
	
	
	if (cron[i].script) {
		if (!manager.exists( cron[i]['id'])) {
			
			manager.add( cron[i]['id'], cron[i]['schedule'], f(cron[i]), null, false, "America/Los_Angeles");
		} else {
			manager.deleteJob( cron[i]['id']);
		}
		manager.start( cron[i]['id']);
	}	
}
*/
