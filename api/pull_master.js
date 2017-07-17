    var http = require('http');
    var fs = require('fs');
    var request = http.get('https://github.com/b2blosangeles/shusiou_api/blob/master/api/cloud_resource.report', function(response) {
       res.send(response)
    });
