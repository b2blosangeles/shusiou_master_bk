pkg.request({
    url: 'http://api.shusiou.com/api/shusiou_get_default_ad.js',
    method: "POST",
    headers: {
        "content-type": "application/json",
        },
    json: {niu:1}
    }, function (error, resp, body) { 
      res.send(resp);
   });


