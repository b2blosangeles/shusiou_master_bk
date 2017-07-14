var total_size = 0;
function uu(dir, cbk) {
 //   var d = dir || process.argv[2] || '.';
    var d = dir || '.';
    var finder = require(env.root_path + '/api/findit.js')(d);
    var path = require('path');

    

    finder.on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules') stop()
      //  else console.log(dir + '/')
        total_size += stat.size;
    });

    finder.on('file', function (file, stat) {
        total_size += stat.size;
      //  console.log(file);
 //     console.log(file+'--:--'+stat.size)
    });

    finder.on('link', function (link, stat) {
        
     //   console.log(link);
    //    console.log(link + '--' + stat.size);
    });
    
    finder.on('end', function (link, stat) {
        if (typeof cbk == 'function') {
            cbk();
        }
    });


}

uu('.', function() {
    var str = 'total size:' + (total_size/1024/1024).toFixed(0) + ' MB';
   res.send(str);
});
