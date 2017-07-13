pkg.request({
    url: 'http://api.shusiou.com/api/test_mysql.js',
    method: "POST",
    headers: {
        "content-type": "application/json",
        },
    json: {niu:1}
    }, function (error, resp, body) { 
      res.send(typeof body);
   });


