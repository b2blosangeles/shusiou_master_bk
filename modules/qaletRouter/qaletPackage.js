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
		this.sendHeader = function() {
			var me = this;
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.header('Access-Control-Allow-Headers', 'Content-Type'); 
			if (me.file_type == 'js' || me.file_type == 'jsx') {
				res.setHeader('Content-Type', "text/javascrip");
			} else if (me.file_type == 'css') {
				me.is_css = true;
				res.setHeader('Content-Type', "text/css");
			} else {
				res.setHeader('Content-Type', "text/html");
			}			
		}
		this.load = function(fn) {
			var me = this, patt = /(\.min|)\.(js|css|jsx)$/i;
			var v = fn.match(patt);
			if (!v) {
				res.send('unsupported file type!');
				return true;
			} else if (v[1]) {
				me.mini_code = true;
			} else {
				me.mini_code = false;
			}
			me.file_type = v[2];
			fn = fn.replace(patt, '.'+v[2]);

			pkg.fs.exists(fn, function(exists) {
				if (exists) {
					me.readJson(env.root_path, fn, function(data) {
						res.send(fn);
					});
													
				} else {
					me.send404(v);					
				} 
			});			
			return true;			
		}	
		
		this.sendFileType = function(path) {
			var me = this;
			if (path.match(/\.min\.(js|css|jsx)$/i)) {
				me.mini_code = true;
			} else {
				me.mini_code = false;
			}
			me.is_css = false;
			var p = path.match(/\.([a-z]+)$/i);
			if ((p) && p[1] == 'js') {
				res.setHeader('Content-Type', "text/javascrip");
			} else if ((p) && p[1] == 'css') {
				me.is_css = true;
				res.setHeader('Content-Type', "text/css");
			} else {
				res.setHeader('Content-Type', "text/html");
			}
		}
		
		this.miniCode = function(code) {
			var me = this;
			var RE_BLOCKS = new RegExp([
			  /\/(\*)[^*]*\*+(?:[^*\/][^*]*\*+)*\//.source,           
			  /\/(\/)[^\n]*$/.source,                                 
			  /"(?:[^"\\]*|\\[\S\s])*"|'(?:[^'\\]*|\\[\S\s])*'/.source, 
			  /(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/])/.source,           
			  /\/(?=[^*\/])[^[/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[/\\]*)*?\/[gim]*/.source
			  ].join('|'),                                          
			  'gm'  
			);
			if (!me.mini_code) {
				return code;
			} else {
				return code.replace(RE_BLOCKS, function (match, mlc, slc) {
					return mlc ? ' ' :       
						   slc ? '' :         
						   match;             
				  }).replace(/(\n|\r\n|\r|\t)/gm, ' ').replace(/\s+/gm, ' ').replace(/^\s+/gm, '');			
			}	
		};
		this.packCSSFile = function(space_root, o, callback) {
			var me = this;
			var _f = {};
			var rr = o.filelist, arr=[], main_list = {};
			for (var k in rr) {
				main_list[rr[k].replace(/\s/g,'')] = true;
			}
			var plus_arr = (!req.query.plus)?[]:(req.query.plus.split(','));
			if ((plus_arr[0]) && plus_arr[0].replace(/\s/g,'') === 'all' && typeof o.mservice == 'object') {
				plus_arr = [];
				for (var k in o.mservice) {
					plus_arr[plus_arr.length] = k;					
				}	
			}	
			for (var k in main_list) {
				arr.push({path:k, code:''});
			}
			
			if ((o.mservice) && typeof o.mservice == 'object') {
				var css = require(__dirname + '/_X/cssrange/pkg/css/node_modules/css');
				function ruleSelect(rule, code) {
					var c = (code[0] == '.')?code:('#' + code);
					if (rule.selectors) {
						 for (s in rule.selectors) {
							rule.selectors[s] = c + ' ' + rule.selectors[s];

						 }
					} else {
						for (r in rule.rules) {
							ruleSelect(rule.rules[r], code);
						}
					}
				}				
				for (var k in plus_arr) {
					if (o.mservice[plus_arr[k]]) {
						var m = (typeof o.mservice[plus_arr[k]] === 'string')?o.mservice[plus_arr[k]].split(','):o.mservice[plus_arr[k]];
						for (var j=0; j < m.length; j++) {
							arr.push({path:m[j].replace(/\s/g,''), code:plus_arr[k]});
						}
						
					}
				}
			}
			
			for (var v in arr) {
				_f['['+arr[v].code+']'+arr[v].path] = (function(v) {
					var fn = space_root +me._cdn + arr[v].path;
					fn = fn.replace(/\/\//ig,'/');
					return function(cbk) {
						pkg.fs.exists(fn,function(exists){
							if(exists){
								pkg.fs.readFile(fn,'utf8', function (err,data) {
										if (!err) {
											if (arr[v].code) {
												try {
											var obj = css.parse(data.replace(/\}([\;|\s]*)/g,'} '));
													ruleSelect(obj.stylesheet, '.class_'+arr[v].code);
													var s = '.class_'+arr[v].code + ' { all: initial; all:default} ' + css.stringify(obj);	
													cbk(me.miniCode(s));											
												} catch (err) {
													cbk('/*' + err.message + '*/');
												}
											} else {
												cbk(me.miniCode(data.replace(/\}([\;|\s]*)/g,'} ')))
											}
										
										} else {
											cbk('');
										}
									});
							} else {
								cbk('');
							}
						});		
					}

				})(v);
			}

			var cp = new pkg.crowdProcess();
			cp.serial(
				_f,
				function(data) {
					var str0 = "";
					var _C = '', _CC = '';
			
					str0 += "/*==== Built time : " + ((!me.mini_code && false)?data._spent_time:'--') + " ms: ====*/\n\n"; 
					
					var code_result = {}, path_result = {};
					for (var v in arr) {
						
						if (!path_result[arr[v].code]) path_result[arr[v].code] = '';
						path_result[arr[v].code] += arr[v].path + '; ';	

						if (!code_result[arr[v].code]) code_result[arr[v].code] = '';
						code_result[arr[v].code] += "\n/**** " + arr[v].path + " ****/\n" + 
						data.results['['+arr[v].code+']'+arr[v].path] + "\n";
						
					}
					
					if (path_result['']) _C += '/*---- File list:' + path_result[''] + ' ----*/'+ "\n";
					if (code_result['']) _CC += "\n"+'/* --- Files: ---> */' + "\n\n" + code_result[''] + "\n\n";
					
					var _CM = '';
					for (var k in path_result) {
						if (!k) continue;
						_C += "\n/*---- Mservice " + k + ' file list:' + path_result[k] + " ----*/\n";
						_CM += "\n/*---- Mservice " + k + ' files ---->*/' + "\n" +
							code_result[k]  + "\n\n";
					} 
					var orig_code = str0 + _C + "\n\n" + _CC +  _CM;
					res.send(orig_code);
				},
				30000
			);
		}
		this.packJsFile = function(space_root, o, callback) {
			var me = this;
			var qaletBabel = false;
			var _f = {};
			var t_arr = [], t_json = {};
			if (o.tpls) {
				for (var i=0; i < o.tpls.length; i++) {
					t_json[o.tpls[i]] = true;
				}
			}
			/*-- prepare data set -> */
			var d_arr = [], d_json = {};
			if (o.data) {
				for (var i=0; i < o.data.length; i++) {
					d_json[o.data[i]] = true;
				}
			}			
			/* <-- prepare data set */
			
			var rr = o.filelist, arr=[], main_list = {};
			for (var k in rr) {
				main_list[rr[k].replace(/\s/g,'')] = true;
			}
			var plus_arr = (!req.query.plus)?[]:(req.query.plus.split(','));
			if ((plus_arr[0]) && plus_arr[0].replace(/\s/g,'') === 'all' && typeof o.mservice == 'object') {
				plus_arr = [];
				for (var k in o.mservice) {
					plus_arr[plus_arr.length] = k;					
				}	
			}

			if ((o.dependence) && typeof o.dependence == 'object') {
				for (var k in plus_arr) {
					if (o.dependence[plus_arr[k]]) {
						var m = (typeof o.dependence[plus_arr[k]] === 'string')?o.dependence[plus_arr[k]].split(','):o.dependence[plus_arr[k]];
						for (var j=0; j < m.length; j++) {
							main_list[m[j].replace(/\s/g,'')] = true;
						}
						
					}
				}
			}	
			
			for (var k in main_list) {
				arr.push({path:k, code:''});
			}
			
			if ((o.mservice) && typeof o.mservice == 'object') {
				for (var k in plus_arr) {
					if (o.mservice[plus_arr[k]]) {
						var m = (typeof o.mservice[plus_arr[k]] === 'string')?o.mservice[plus_arr[k]].split(','):o.mservice[plus_arr[k]];
						for (var j=0; j < m.length; j++) {
							arr.push({path:m[j].replace(/\s/g,''), code:plus_arr[k]});
						}
						
					}
				}
			}				

			/* -- data process -- */
			
			if ((o.ms_data) && typeof o.ms_data == 'object') {
				for (var k in plus_arr) {
					if (o.ms_data[plus_arr[k]]) {
						var m = (typeof o.ms_data[plus_arr[k]] === 'string')?o.ms_data[plus_arr[k]].split(','):o.ms_data[plus_arr[k]];
						for (var j=0; j < m.length; j++) {
							d_json[m[j].replace(/\s/g,'')] = true;
						}
						
					}
				}
			}			
			
			for (var k in d_json) {
				d_arr.push(k);
			}
			if (d_arr) {
				for (var v in d_arr) {
					_f['_DATA_'+d_arr[v]] = (function(v) {
						var fn = space_root +'/files' + d_arr[v];
						res.send(fn);
						return true;
						return function(cbk) {
							pkg.fs.exists(fn,function(exists){
								if(exists){
									pkg.fs.readFile(fn,'utf8', function (err,data) {
										if (!err) {
											cbk('_DATA_["'+d_arr[v]+'"] = '+ me.miniCode(data) + ';');
										} else {
											cbk('');
										}
									});
								} else {
									cbk('');
								}
							});		
						}

					})(v);
				}
			}	
			/* -- data process end -- */			
			
			
			/* -- tpl process -- */
			if ((o.ms_tpls) && typeof o.ms_tpls == 'object') {
				for (var k in plus_arr) {
					if (o.ms_tpls[plus_arr[k]]) {
						var m = (typeof o.ms_tpls[plus_arr[k]] === 'string')?o.ms_tpls[plus_arr[k]].split(','):o.ms_tpls[plus_arr[k]];
						for (var j=0; j < m.length; j++) {
							t_json[m[j].replace(/\s/g,'')] = true;
						}
						
					}
				}
			}			
			
			for (var k in t_json) {
				t_arr.push(k);
			}
			if ((t_arr) && !me.is_css) {
				for (var v in t_arr) {
					_f['_tpl_'+t_arr[v]] = (function(v) {
						var fn = space_root + '/files' + t_arr[v];
						return function(cbk) {
							pkg.fs.exists(fn,function(exists){
								if(exists){
									pkg.fs.readFile(fn,'utf8', function (err,data) {
										if (!err) {
											cbk('_TPL_["'+t_arr[v]+'"] = decodeURIComponent("'+encodeURIComponent(data.replace(/\n|\r\n|\r/g, ' '))+'");');
										} else {
											cbk('');
										}
									});
								} else {
									cbk('');
								}
							});		
						}

					})(v);
				}
			}	
			/* -- tpl process end -- */			
			
			for (var v in arr) {
				_f['['+arr[v].code+']'+arr[v].path] = (function(v) {
					var fn = space_root + '/files' + arr[v].path;
					fn = fn.replace(/\/\//ig,'/');
					return function(cbk) {
						pkg.fs.exists(fn,function(exists){
							if(exists){
								
		
								if (fn.match(/\.(jsx)$/i)) {
									if (!qaletBabel) {
										var Babel  = require(env.root_path + "/package/qaletBabel/qaletBabel.js");
										qaletBabel = new Babel();
									}									
									pkg.fs.stat(fn, function(err, s){
										if (err) {
											cbk('console.log("'+err.message.replace('"', '')+'");');
										} else {										
											pkg.db.jsx_cache.find({file:fn}, function (err, docs) {	
												if (err) {
													cbk('console.log("'+err.message.replace('"', '')+'");');
												} else if (!docs || !docs.length) {
													qaletBabel.jsx2js(fn, function(err, v) {
														if (err) {
															cbk('console.log("'+err.message.replace('"', '')+'");');
														} else {
															pkg.db.jsx_cache.insert({file:fn, mtime:s.mtime.getTime(), doc:v.code}, function (err, newDoc) {   
																if (err) {
																	cbk('console.log("'+err.message.replace('"', '')+'");');
																} else {						
																	cbk(me.miniCode(newDoc.doc));
																}	
															});
														}   
													});													

												} else {
													if (docs[0].mtime != s.mtime.getTime()) {
														qaletBabel.jsx2js(fn, function(err, v) {
															if (err) {
																cbk('console.log("'+err.message.replace('"', '')+'");');
															} else {
																pkg.db.jsx_cache.update({file:fn},
																	{$set: {mtime:s.mtime.getTime(), doc:v.code}}, function (err, newDoc) {   
																	if (err) {
																		cbk('console.log("'+err.message.replace('"', '')+'");');
																	} else {						
																		cbk(me.miniCode(v.code));
																	}	
																});
															}
														});		
													} else {
														cbk(me.miniCode(docs[0].doc));
													}
													
												}
												
											});												
										}   
										
									});									
										
								} else {
									pkg.fs.readFile(fn,'utf8', function (err,data) {
											if (!err) {
												cbk(me.miniCode(data));
											} else {
												cbk('');
											}
										});
								}	
	
							} else {
								cbk('');
							}
						});		
					}

				})(v);
			}

			var cp = new pkg.crowdProcess();
			cp.serial(
				_f,
				function(data) {
					
					var str0 = 'if (!console) var console ={}; ';
					str0 += "if (!console.log) console.log =function() {}; \n";
					var _T = '', _D = '', _TC = '', _DC = '', _C = '', _CC = '';
			
					str0 += "/*==== Built time : " + ((!me.mini_code && false)?data._spent_time:'--') + " ms: ====*/\n\n"; 
					str0 += 'if (!_TPL_) var _TPL_ = {};' + "\n\n";
					str0 += 'if (!_DATA_) var _DATA_ = {}; ' + "\n\n";
					
					_T += '/*---- Template files: ';
					for (var k in t_arr) {
						_T += t_arr[k] + '; ';
						_TC += data.results['_tpl_'+t_arr[k]]+ "\n";
					}
					_T += " ----*/\n";

					_D += '/*---- Data files: ';
					for (var k in d_arr) {
						_D += d_arr[k] + '; ';
						var syntax = pkg.syntaxError(data.results['_DATA_' + d_arr[k]]);
						if (syntax) {
							_DC += 'console.log("Package error on data file ' + d_arr[k] + ' ->'+ '"); ' + "\n" +
							'console.log(decodeURIComponent("'+ encodeURIComponent(JSON.stringify(syntax)) + '"));' + "\n";
						} else {	
							_DC += data.results['_DATA_' + d_arr[k]]+ "\n";
						}
					}
					_D += " ----*/\n";
					
					var code_result = {}, path_result = {};
					for (var v in arr) {
						
						if (!path_result[arr[v].code]) path_result[arr[v].code] = '';
						path_result[arr[v].code] += arr[v].path + '; ';	

						if (!code_result[arr[v].code]) code_result[arr[v].code] = '';
						code_result[arr[v].code] += "\n/**** " + arr[v].path + " ****/\n" + data.results['['+arr[v].code+']'+arr[v].path]+ "\n";
						
					}	
					if (path_result['']) _C += '/*---- File list:' + path_result[''] + ' ----*/'+ "\n";
					if (code_result['']) _CC += "\n"+'/* --- Files: ---> */' + "\n\n" + 
						code_result[''] + "\n\n";
					
					var _CM = '';
					for (var k in path_result) {
						if (!k) continue;
						var _v = code_result[k];
						var syntax = pkg.syntaxError(_v);
						if (syntax) {
							_v = 'console.log("Package error on ' +  path_result[k] + ' ->'+ '"); ' + "\n" +
							'console.log(decodeURIComponent("'+ encodeURIComponent(JSON.stringify(syntax)) + '"));' + "\n";
						}
						_C += "\n/*---- Mservice " + k + ' file list:' + path_result[k] +  "----*/\n";
						_CM += "\n/*---- Mservice " + k + ' files ---->*/' + "\n" +
							'_QALET_._Q["'+k+'"] = function(mapping_data) {' + _v + '}; ' + "\n\n";
					}
					if (_CM) {
						_CC += 'if (!_QALET_) var _QALET_={_p:0, data:{},_Q:{}, _newlet:{}, _d:{}}; '+ 
							_CM +
							'// if (typeof _INITQALET_ == "function") _INITQALET_(); '
					}
					
					var cbk_s = (!req.query.callback)?'':req.query.callback;
					
					var orig_code = str0 +  _T + _D + _C + "\n\n" + _TC + _DC + _CC
					if (cbk_s) orig_code+= "\n" + 'if (typeof ' + cbk_s + ' == "function") ' + cbk_s+'();';
					
					res.send(orig_code);
				},
				30000
			);
		}

		this.readJson = function(space_root, path, callback) {
			var me = this;
			pkg.fs.readFile(path, function (err, data) {
				if (err) {
					me.send500(err);
				} else {
					try {
						var v = JSON.parse(data);
						if ((v.filelist) && (Array.isArray(v.filelist))) {
							if (me.file_type == 'css') me.packCSSFile(space_root, v, callback);
							else {
								me.packJsFile(space_root, v, callback);
							}	
						} else {
							me.send500({message:'incorrect array format'});
						}
					} catch(err) {
						me.send500({message:'1 incorrect array format'});
					}
					
				} 
			});	
		}	
		this.callAfterVhost = function(vhost) {
			var me = this;
			var spacename = this.getSpacename(vhost);

			var space_dir, space_root, fn, space_fn;
			
			if (req.params[0]) {
				fn = (req.params[0])?req.params[0].replace(/\.min\.(js|css|jsx)$/i, ".$1"):'';
			}
			
			if (spacename) {
				space_dir = env.root_path + '/_microservice/' + spacename + '/package/' + req.params[0];
				space_root = env.root_path + '/_microservice/' + spacename;
				space_fn = env.root_path + '/_microservice/' + spacename + '/package/' + fn;
				
			} else {
				space_dir = env.root_path + '/defaultsite/www/package/' + req.params[0];
				space_root = env.root_path + '/defaultsite/www';
				space_fn = env.root_path + '/defaultsite/www/package/' + fn;
			}
			
			
			pkg.fs.exists(space_fn, function(exists) {
				if (exists) {
					pkg.fs.stat(space_fn, function(err, stats) {
						if (stats.isFile()) { 
							me.sendFileType(space_dir);	
							me.readJson(space_root, space_fn, function(data) {
								res.send(data);
							})
						} else {
							me.send404(fn + ' does not exist!');								 
						}
					});									
				} else {
					me.send404(req.params[0] + ' does not exist!');						
				} 
			});				
			return true;
		};	
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 
	
})();
