function getServerIP() {
    var ifaces = require('os').networkInterfaces(), address=[];
    for (var dev in ifaces) {
        var v =  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false);
        for (var i=0; i < v.length; i++) address[address.length] = v[i].address;
    }
    return address;
};


var diskspace = require(env.root_path + '/package/diskspace/node_modules/diskspace');
diskspace.check('/', function (err, result)
{
    pkg.request({
        url: 'http://api.shusiou.com/api/test_mysql.js',
        method: "POST",
        headers: {
            "content-type": "application/json",
            },
        json: {ip:getServerIP(), status:result}
        }, function (error, resp, body) { 
          res.send(body);
       });

});
return true;



