var forderP  = new require(env.root_path + '/api/inc/folderP/folderP.js')();
forderP.build('/var/video/', function() {
  res.send('/api/inc/folderP/folderP.js niu');
});

