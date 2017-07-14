var path = require('path');
var env = {root_space:path.join(__dirname, '../../')};

var diskspace = require(env.root_path + '/package/diskspace/node_modules/diskspace'),
    request = require(env.root_path + '/package/request/node_modules/request');
    
diskspace.check('/', function (err, space)
{
    request({
        url: 'http://api.shusiou.com/api/test_mysql.js',
        method: "POST",
        headers: {
            "content-type": "application/json",
            },
        json: {ip:getServerIP(), space:space}
        }, function (error, resp, body) { 
        //  res.send(body);
       });

});
