var fs = require('fs');
var path = require('path');

module.exports = function (robot, scripts) {
  var scriptsPath = path.resolve(__dirname, 'src');
  fs.exists(scriptsPath, function(exists){
    if(exists) {
      var dir = fs.readdirSync(scriptsPath);
      for(var i = 0; i < dir.length; i++) {
        var script = dir[i];
        if(scripts && scripts.indexOf('*') === -1) {
          if(scripts.indexOf(scripts) !== -1) {
            robot.loadFile(scriptPath, script);
          }
        } else {
          robot.loadFile(scriptsPath, script)
        }
      }
    }
  });
}