var fs = require('fs')
  , path = require('path');

function combineManifest(callback) {
  fs.readdir(__dirname, function(err, filenames) {
    if (err) {
      callback(err);
      return;
    }
    filenames = filenames.filter(function (filename) {
      return filename.indexOf('.json') !== -1 && filename.indexOf('manifest.json') === -1;
    });
    var manifest = [];
    filenames.forEach(function(filename) {
      manifest.push(require(path.join(__dirname, filename)));
    });

    manifest.sort(function(a,b) {
      if (parseInt(a.revision) > parseInt(b.revision))
        return -1;
      if (parseInt(a.revision) < parseInt(b.revision))
        return 1;
      return 0;
    });

    if (manifest.length) {
      var latest = manifest[0].revision;
      manifest.forEach(function(build) {
        if (build.revision == latest)
          build.latest = true;
      });
    }

    fs.writeFile('manifest.json', JSON.stringify(manifest, null, 2), 'utf8', callback);
  });
}

// Combine the manifest files
combineManifest(function(err) {
  if (err)
    console.log('Error', err)
  else
    console.log('Combined manifest')
});
