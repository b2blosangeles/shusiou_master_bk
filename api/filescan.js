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
       var ff =  ' bytes on both *nix and Windows systems. bytes on both *nix and Windows systems. bytes on both *nix and Windows systems.';
       ff = file; 
       total_size += stat.size;
        var patt = new RegExp('^'+ dir, 'i');
     //  _result[_result.length] = {"path":file.replace(patt, 'A')};
       _result[_result.length] = {"path":ff};
       // _result[_result.length] = file;
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


uu('/var/lib/', function() {
// uu(env.root_path + '', function() {
    var str = 'total size:' + (total_size/1024/1024).toFixed(0) + ' MB (' + total_size + ')';
//   res.send(str);
  res.send(_result);
});
