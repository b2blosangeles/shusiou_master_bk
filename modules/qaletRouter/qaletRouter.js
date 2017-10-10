(function () { 
	
	var obj =  function (pkg, env, req, res, io) {

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
		this.sendPackage = function(v) {
			var me = this;
			var patt = /\.(jsx|js|css)$/i;
			f (patt.test(v)) {
				var fn = env.root_path + '/files/package/' + v;
				pkg.fs.exists(fn, function(exists) {
					if (exists) {
						res.send('package '+fn); 									
					} else {
						me.send404(v);					
					} 
				});
			} else {
				me.send404(v);	
			}
		};		
		this.sendFile = function(v) {
			var me = this, fn = env.root_path + '/files/' + v;
			pkg.fs.exists(fn, function(exists) {
				if (exists) {
					res.sendFile(fn); 									
				} else {
					me.send404(v);					
				} 
			});				
		};
		
		this.runApi = function(v) {
			var me = this;
			var p = env.root_path + '/api/' + v;
			var patt = new RegExp('.js$', 'i');
			if (!patt.test(v)) {
				me.send404(v);
				return true;
			}
			
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
												root_path:env.root_path
											}
											new Function('require', 'pkg', 'env', 'req', 'res', 'io', code)
											(require, pkg, localenv, req, res, io);
										} catch(err) {
											me.send500(err);
										}
									} else {
										me.send500(err);										
									}
								});								
							}		

						 } else {
							me.send404(v);									 
						 }
					});									
				} else {
					me.send404(v);						
				} 
			});	
		}		
		
		this.getServerIP = function() {
			var ifaces = require('os').networkInterfaces(), address=[];
			for (var dev in ifaces) {
				var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
				for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
			}
			return address;
		};		
		
		this.load = function() {
			var me = this, p = req.params[0];
			var patt = new RegExp('/(api|checkip|package)/(.+|)', 'i');
			var v = p.match(patt);
			if ((v) && typeof v == 'object') {
				switch (v[1]) {
					case 'api':
						me.runApi(v[2]);
						break;
					case 'checkip':
						res.send(JSON.stringify(me.getServerIP()));
						break;	
					case 'package':
						me.sendPackage(v[2]);
						break;						
					default:
						me.send404(p);
				}		
			} else {
				if (p.match(/\/$/i)) {
					p+='index.html';
				}				
				me.sendFile(p);
			}
		};	
	
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
