var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var folderP  = new FOLDERP ();

folderP.build('/var/video/', function() {
  res.send('/api/inc/folderP/folderP.js niu 2');
});

