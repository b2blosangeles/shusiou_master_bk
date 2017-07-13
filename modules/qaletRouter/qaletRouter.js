(function () { 
	
	var obj =  function (pkg, env, req, res, io) {
	
		this.getSpacename = function(vhost) {
			for (var i=0; i < vhost.length; i++) {
				if (vhost[i].domain){
					var patt = new RegExp(vhost[i].domain, 'i');
					if (patt.test(req.headers.host)) {
						return vhost[i].name;
					}					
				}
			}
			return false;	
		};	

		this.setLog = function(space) {
			if (!env.logger) {
				env.logger = {}
			}	
			if (!env.logger[space]) {
				var winston = require( env.root_path +'/package/winston/node_modules/winston');
				env.logger[space] = new (winston.Logger)({
				  transports: [
					new (winston.transports.File)({
					  name: 'info-file',
					  filename: env.root_path+'/_log/'+space+'-info.log',
					  level: 'info'
					}),
					new (winston.transports.File)({
					  name: 'error-file',
					  filename: env.root_path+'/_log/'+space+'-error.log',
					  level: 'error'
					})
				  ],
				  exceptionHandlers: [
					  new winston.transports.File({ filename: env.root_path+'/_log/'+space+'-exceptions.log' })
					],
					exitOnError: false
				});
			}
			return false;	
		};	

		
		this.requestType = function() {
			var patt = new RegExp('^/(api|test)/(.+|)', 'i');
			
			if (req.params[0]) {
				var v0 = req.params[0].match(/^\/\//i);
				if (v0) {
					return '.error';
				} 
				var v = req.params[0].match(patt);
				if (v) {
					return v;
				} 
			} 
			return false;
		}
		this.send404 = function(v) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write(v + ' does not exist');
			res.end();		
		}	
		this.send500 = function(err) {
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.write('Error! ' + err.message);
			res.end();			
		}			
		this.runApi = function(v, vhost) {
			var me = this;
			var spacename = this.getSpacename(vhost);
			var space_dir = env.root_path + '/_microservice/' + spacename;
			var p = space_dir + '/api/' + v;

			pkg.fs.exists(p, function(exists) {
				if (exists) {
					pkg.fs.stat(p, function(err, stats) {
						 if (stats.isFile()) {
							
							try {
								delete require.cache[p];
								var taskClass = require(p);
								var entity = new taskClass(pkg, env, req, res, io);
								entity.call();
							} catch(err) {
								pkg.fs.readFile(p, 'utf8', function(err, code) {
									if (!err) {
										try {
											var localenv = {
												vhost_code: spacename,
												root_path:env.root_path,
												space_path:space_dir
											}
											new Function('require', 'pkg', 'env', 'req', 'res', 'io', 'logger', code)
											(require, pkg, localenv, req, res, io, env.logger[spacename]);
										} catch(err) {
											me.send500(err);
										}
									} else {
										me.send500(err);										
									}
								});								
							}		

						 } else {
							me.send404(req.params[0]);									 
						 }
					});									
				} else {
					me.send404(req.params[0]);						
				} 
			});	
		}	

		this.runTest = function(v, vhost) {
			var me = this;
			var spacename = this.getSpacename(vhost);
			var space_dir = env.root_path + '/_microservice/' + spacename;
			var p = space_dir + '/test/' + v;
			
			pkg.fs.exists(p, function(exists) {
				if (exists) {
					pkg.fs.stat(p, function(err, stats) {
						 if (stats.isFile()) {
							var path = require('path');
							var Mocha = require(path.join(env.root_path, '/package/mocha/node_modules/mocha'));
							var mocha = new Mocha;
							mocha.addFile(p);
							mocha.reporter('json');

							var write = process.stdout.write;
							var output = '';
							process.stdout.write = function(str) {
							  output += str;
							};

							mocha.run(function(failures) {
							  process.stdout.write = write;
							  res.send(JSON.parse(output))
							});
						 } else {
							me.send404(req.params[0]);									 
						 }
					});									
				} else {
					me.send404(req.params[0]);						
				} 
			});	
		}	
		this.getServerIP() {
			var ifaces = require('os').networkInterfaces(), address=[];
			for (var dev in ifaces) {
				var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
				for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
			}
			return address;
		}
		
		this.load = function() {
			var me = this;
			res.send(me.getServerIP());
			return true;
			
			var p = req.params[0];
			if (p.match(/\/$/i)) {
				p+='index.html';
			}			
			res.send(p + req.get('host') + '===>' + address);
			return true;
			pkg.db.vhost.find({}, function (err, vhost) {
				if (!err) {
					me.callAfterVhost(vhost);
				} else {
					res.send(err)
				}
				
			});	
		}	
		this.callRouter = function(path, spacename, p_1) {
			var p_0 = p_1.replace(/\/index\.html$/, '').replace(/\/([^\/]+)$/, '');
			var me = this, p = '/index.html';
			
			
			pkg.fs.exists(env.root_path + '/_microservice/' + spacename + p_0 + p, function(exists) {
				if (exists) {
					pkg.fs.stat(env.root_path + '/_microservice/' + spacename + p_0 + p, function(err, stats) {
						 if (stats.isFile()) { 
							res.sendFile(env.root_path + '/_microservice/' + spacename + p_0 + p); 	
						 } else {
							if (p_0) {
								me.callRouter(path, spacename, p_0 + p);
							} else {
								me.send404(path);
							}	
						 }
					});									
				} else {
					if (p_0) {
						me.callRouter(path, spacename, p_0 + p);
					} else {
						me.send404(path);
					}					
				} 
			});	
		}
		
		this.callAfterVhost = function(vhost) {
			var me = this;
			var spacename = this.getSpacename(vhost);

			if (spacename) {
				me.setLog(spacename);
			} else {
				me.setLog('default_cron');
				me.setLog('default_api');
				me.setLog('default_git');
			}
			var cronP = req.params[0].match(/_cron\/(|.+)$/i);
			if (cronP) {
				delete require.cache[env.root_path + '/modules/cronModule/cronModule.js'];
				var cronModule  = require(env.root_path + '/modules/cronModule/cronModule.js');
				var cronm = new cronModule(pkg, env, req, res, env.logger['default_cron']);
				cronm.load(cronP[1], spacename);				
				return true;
			}

			var apiP = req.params[0].match(/_api\/(|.+)$/i);
			if (apiP) {
				delete require.cache[env.root_path + '/modules/apiModule/apiModule.js'];
				var apiModule  = require(env.root_path + '/modules/apiModule/apiModule.js');
				var apim = new apiModule(pkg, env, req, res, env.logger['default_api']);
				apim.load(apiP[1], spacename);				
				return true;
			}

			var gitP = req.params[0].match(/_git\/(|.+)$/i);
			if (gitP) {
				delete require.cache[env.root_path + '/modules/gitModule/gitModule.js'];
				var gitModule  = require(env.root_path + '/modules/gitModule/gitModule.js');
				var gm = new gitModule(pkg, env, req, res, env.logger['default_git']);
				gm.load(gitP[1], spacename);				
				return true;
			}

			var tp = this.requestType();	
			if (tp !== false) {
				if (tp[1] == 'api') {
					this.runApi(tp[2], vhost);
				} else {
					this.runTest(tp[2], vhost);
				} 
				return true;
			}
			
			var path = require('path');
			var p = req.params[0];
			if (p.match(/\/$/i)) {
				p+='index.html';
			}
			
			var patt = new RegExp('^cdn([0-9]+|)\.([^.]+)\.([^.]+)', 'i');
			var p_1 =  ((patt.test(req.headers.host))?'/cdn':'') + p
			if (spacename) {
				pkg.fs.exists(env.root_path + '/_microservice/' + spacename + p_1, function(exists) {
					if (exists) {
						pkg.fs.stat(env.root_path + '/_microservice/' + spacename + p_1, function(err, stats) {
							 if (stats.isFile()) { 
								res.sendFile(env.root_path + '/_microservice/' + spacename + p_1); 	
							 } else {
								me.callRouter(req.params[0], spacename, p_1);								 
							 }
						});									
					} else {
						me.callRouter(req.params[0], spacename, p_1);					
					} 
				});	
			} else {
				pkg.fs.exists(env.root_path + '/defaultsite/www' + p_1, function(exists) {
					if (exists) {
						pkg.fs.stat(env.root_path + '/defaultsite/www' + p_1, function(err, stats) {
							 if (stats.isFile()) { 
								res.sendFile(env.root_path + '/defaultsite/www' + p_1); 	
							 } else {
								me.send404(req.params[0]);								 
							 }
						});									
					} else {
						me.send404(req.params[0]);						
					} 
				});	
			}
		};	
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
