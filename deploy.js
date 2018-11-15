const fs = require('fs');
const path = require('path');
var copydir = require('copy-dir');
var rimraf = require('rimraf');

let destDir = 'D:\\server_root';

function copyFile(src, dest) {

    let readStream = fs.createReadStream(src);
  
    readStream.once('error', (err) => {
      console.log(err);
    });
  
    readStream.once('end', () => {
      console.log('done copying');
    });
  
    readStream.pipe(fs.createWriteStream(dest));
  }
  
rimraf(destDir, function () { 
    console.log('clear done'); 
    fs.mkdirSync(destDir);
    copydir.sync(path.join(__dirname, 'api'), destDir, function(){return true}, function(err){
        console.log('copy api error:', err);
    });
    console.log('copy api ok');
    copydir.sync(path.join(__dirname, 'dist'), path.join(destDir, 'dist'), function(){return true}, function(err){
        console.log('copy dist error:', err);
    });

    let filename = 'setup_service.js';
    let src = path.join(__dirname, filename);
    fs.access(destDir, (err) => {
       if(err)
         fs.mkdirSync(destDir);
     
       copyFile(src, path.join(destDir, filename));
   });

   console.log('copy dist ok');
});
  