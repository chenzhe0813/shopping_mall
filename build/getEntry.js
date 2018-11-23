const path = require('path')
const glob = require('glob')
exports.getEntry = function(globPath) {
    var entries = {},
      basename, tmp, pathname;
    if (typeof (globPath) != "object") {
      globPath = [globPath]
    }
    globPath.forEach((itemPath) => {
      glob.sync(itemPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        if (entry.split('/').length > 4) {
          tmp = entry.split('/').splice(-3);
          pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
          entries[pathname] = entry;
        } else {
          entries[basename] = entry;
        }
      });
    });
    return entries;
  }
