var CronJobManager = require('./crontab_manager.js');
var manager = new CronJobManager();
var exec = require('child_process').exec;
var fs    = require('fs'), path = require('path');
var root_path =  path.join(__dirname, '..');

var LOG = require(root_path + '/package/log/log.js');
var log = new LOG();

var conf_file = root_path + '/site/cron/cron.json';

fs.exists(conf_file, function(exists){
	if(exists) {
		var cron = require(conf_file);
		for (var i = 0; i < cron.length; i++) {
			var f = function(v) {
				return function() {
					exec('cd ' + root_path + '/site/cron' + ' &&  ' + v.script, function(error, stdout, stderr) {
						if (!stderr) {
							log.write("/var/log/shusiou_cron.log", JSON.stringify({status:'success', id:v.id, message:stdout}));
						} else {
							log.write("/var/log/shusiou_cron.log", JSON.stringify({status:'error', id:v.id, message:stderr}));
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
	} else {
		console.log('Missing cron.json!');
	}
});
