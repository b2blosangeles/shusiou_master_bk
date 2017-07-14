var total_size = 0;
var _result = [];
function uu(dir, cbk) {
 //   var d = dir || process.argv[2] || '.';
    var d = dir || '.';
 
    var finder = require(env.root_path + '/api/findit.js')(d);
    var path = require('path');

    finder.on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules') stop()
    //    _result[_result.length] = {path:base};
        total_size += stat.size;
    });

    finder.on('file', function (file, stat) {
        total_size += stat.size;
        _result[_result.length] = {"path":file};
         // {path:file};
    });

    finder.on('link', function (link, stat) {
     //  _result[_result.length] = {path:link};
    });
    
    finder.on('end', function (link, stat) {
        if (typeof cbk == 'function') {
            cbk();
        }
    });


}

uu(env.root_path + '/', function() {
    var str = 'total size:' + (total_size/1024/1024).toFixed(0) + ' MB (' + total_size + ')';
//   res.send(str);
  res.send(JSON.stringify(_result));
});
