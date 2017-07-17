    var http = require('http');
    var fs = require('fs');
    var request = http.get('http://api.ahuaiou.com/api/cloud_resource.report', function(response) {
       res.send(response)
    });
