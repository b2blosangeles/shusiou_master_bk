var FOLDERP =  require(env.root_path + '/api/inc/folderP/folderP.js');
var folderP  = new FOLDERP ();
var base = '/var/video/';
folderP.build(base, function() {
     res.send(base);
/*    
    var http = require('http');
  var fs = require('fs');

  var file = fs.createWriteStream(base+'file.png');
  var request = http.get('http://api.shusiou.com/api/pipe_stream.js?video=962SfJ00tYM&fn=images/962SfJ00tYM/180_100.png', function(response) {
        response.pipe(file);
        response.on('end', function() {
          res.sendFile(base + 'file.png');
         // res.send('niu');
        });
  });
//   res.send('niuB');
 // res.sendFile(base + 'file.png');
 */
});

return true;

var request = require(env.root_path + '/package/request/node_modules/request');
request({
    url: 'http://api.shusiou.com/api/cloud_resource.report',
    method: "GET"
    }, function (error, resp, body) { 
      //  res.send(resp);
       res.send(JSON.parse(body).Z2SCXDw0pZ4);
   });
