var exec = require('child_process').exec;
// var path = require('path');
// var env = {root_space:path.join(__dirname, '../../')};
// res.send(env);
// return true;

var request = require(env.root_path + '/package/request/node_modules/request');
request({
    url: 'http://api.shusiou.com/api/cloud_resource.report',
    method: "GET"
    }, function (error, resp, body) { 
      //  res.send(resp);
       res.send(JSON.parse(body).Z2SCXDw0pZ4);
   });
