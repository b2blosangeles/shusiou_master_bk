(function () { 
    var obj =  function () {
    var me = this;
    this.total_size = 0;
    this.master_video = {};
    this._result = {};
    this.last_file = '';
    this.mtime = '';

    this.scan = function(dir, code, cbk) {
        var finder = require(env.root_path + '/api/inc/findit/findit.js')(dir);
        var path = require('path');

        finder.on('directory', function (dir, stat, stop) {
      var base = path.basename(dir);
      me.total_size += stat.size;
        });
        finder.on('file', function (file, stat) {
           var filter_master = /\/video\/video\.mp4$/;
      var patt = new RegExp('^'+ dir);

           if (filter_master.test(file)) {
        me.master_video = {folder:dir, code: code, master_video:file.replace(patt,''), mtime:stat.mtime, size:stat.size};
           }  else {
         me.total_size += stat.size;
         if (!me.mtime) me.mtime = stat.mtime;
         if (new Date(stat.mtime) > new Date(me.mtime)) {
             me.mtime = stat.mtime;
             me.last_file = file.replace(patt,'');
         }
    //    me._result[file.replace(patt,'')] = {mtime:stat.mtime, size:stat.size};
           }
        });
        finder.on('link', function (link, stat) { });

        finder.on('end', function (link, stat) {

      if (typeof cbk == 'function') {
        me.master_video['totalsize'] = me.total_size;
        cbk({master:me.master_video, laster_file:{file:me.last_file, mtime:me.mtime}, list:me._result});
      }
        });


    };
  };
	module.exports = obj;
})();
