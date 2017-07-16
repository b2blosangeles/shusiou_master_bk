var FP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var forderP  = new FP();

forderP.build('/var/video/', function() {
  res.send('/api/inc/folderP/folderP.js niu 1');
});

