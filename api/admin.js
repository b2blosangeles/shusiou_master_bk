var opt = req.param('opt'), code = req.param('code');
if (!code) {
   res.send('missing code!!');
} else {   
   switch(opt) {
      case 'show':
         res.sendFile('/tmp/'+code);
         break;
      case 'remove':
         var exec = require('child_process').exec;
         var cmd = 'rm  /tmp/'+ code;
         exec(cmd, function(error, stdout, stderr) {
             res.send(cmd + ' :: ' + stdout);
           });
         break;
      default:
         res.send('wrong opt!!');
   }
}

//res.sendFile('/tmp/shusiou_git.log');
