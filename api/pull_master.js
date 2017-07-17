var exec = require('child_process').exec;
var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};

var request = require(env.root_path + '/package/request/node_modules/request');
request({
    url: 'http://api.shusiou.com/api/cloud_resource.report',
    method: "GET",
    headers: {
        "content-type": "application/json",
        }
    }, function (error, resp, body) { 
      res.send(body);
   });
