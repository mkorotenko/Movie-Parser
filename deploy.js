const fs = require('fs');
const path = require('path');
var copydir = require('copy-dir');
const fse = require('fs-extra')
var rimraf = require('rimraf');
const exec = require('child_process').exec;

let destDir = 'D:\\server_root';
let success = true;

function deployFiles() {
  //rimraf(destDir, function (error) {

    // if (error) {
    //   success = false;
    //   console.error(error);
    //   return;
    // }

    // console.log('clear done');
    // fs.mkdirSync(destDir);

    copydir.sync(path.join(__dirname, 'api'), destDir, function () { return true }, function (err) {
      console.log('copy api error:', err);
      success = false;
    });
    console.log('copy api ok');

    copydir.sync(path.join(__dirname, 'dist'), path.join(destDir, 'dist'), function () { return true }, function (err) {
      console.log('copy dist error:', err);
      success = false;
    });
    console.log('copy dist ok');

    try {
      fse.copySync(path.join(__dirname, 'service-manager.js'), path.join(destDir, 'service-manager.js'))
      fse.copySync(path.join(__dirname, 'setup_service.js'), path.join(destDir, 'setup_service.js'))
      fse.copySync(path.join(__dirname, 'delete_service.js'), path.join(destDir, 'delete_service.js'))
      // fse.copySync(path.join(__dirname, 'child-manager.js'), path.join(destDir, 'child-manager.js'))
      // fse.copySync(path.join(__dirname, 'mongodb-server.js'), path.join(destDir, 'mongodb-server.js'))
      console.log('copy files ok');
    } catch (err) {
      console.error('copy files error', err)
      success = false;
    }

    // if (success)
    //   exec(`node ${destDir}\\setup_service`,{},function(f, warn, error){
    //     console.info('setup_service:', warn, error);
    //     if (error)
    //       success = false;
    //   });

  //});

}

if (fs.existsSync(`${destDir}\\delete_service`)) {
  exec(`node ${destDir}\\delete_service`,{},function(f, warn, error){
    console.info('delete_service:', warn, error);
    if (error)
      success = false;

    if (success)
    deployFiles();
  })
}
else deployFiles();
