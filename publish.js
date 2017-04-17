var fs = require('fs')
  , path = require('path')
  , exec = require('child_process').exec;

function combineManifest(callback) {
  fs.readdir(__dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames = filenames.filter(function (filename) {
      return filename.indexOf('.json') !== -1 && filename.indexOf('manifest.json') === -1;
    });
    var manifest = [];
    filenames.forEach(function(filename) {
      manifest.push(require(path.join(__dirname, filename)));
    });

    console.log('Combined manifest', manifest)
    fs.writeFile('manifest.json', JSON.stringify(manifest), 'utf8', callback);
  });
}

// Combine the manifest files
combineManifest(function() {

  // Push to git
  console.log('Pushing')
  exec('git add -A && git commit -m "Update build" && git push origin master', function(err, stdout, stderr) {
    if (err != null) {
      console.log('Error', err)
      throw new Error(err);
    } else if (typeof(stderr) != "string") {
      console.log('Error', stderr)
      throw new Error(stderr);
    } else {
      console.log(stdout)
    }
  });
});
