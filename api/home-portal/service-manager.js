var Service = require('node-windows').Service;
// Create a new service object
var svcSettings = {
    name:'Home portal',
    description: 'Home web server.',
    script: require('path').join(__dirname, 'dist-server.js'),
    env: [{
            name: "PORT",
            value: 3100
        },
        {
            name: "PATH_SRC",
            value: "dist"
        },
        {
            name: "MONGO_DB",
            value: true
        }
    ]
}

function getLocalIP() {
  'use strict';

  var os = require('os');
  var ifaces = os.networkInterfaces();

  return Object.keys(ifaces).map(function (ifname) {
    let ips = ifaces[ifname].map(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      return iface.address;
    }).filter(ip => ip);
    return ips.join(':');
  }).filter(ip => ip).join(':');
}
module.exports = {
    install: function() {
        // Create a new service object
        var svc = new Service(svcSettings);
        return new Promise((resolve, reject) => {
            // Listen for the "install" event, which indicates the
            // process is available as a service.
            svc.on('install',function(){
                svc.start();
            });
    
            // Just in case this file is run twice.
            svc.on('alreadyinstalled',function(){
                console.log('This service is already installed.');
                resolve();
            });
    
            // Listen for the "start" event and let us know when the
            // process has actually started working.
            svc.on('start',function(){
                console.log(`${svc.name} started!\nVisit ${getLocalIP()}`);
                resolve();
            });
    
            svc.on('error',function(error){
                console.error(error);
                reject();
            });
    
            // Install the script as a service.
            svc.install();
        })
    },
    uninstall: function() {
        // Create a new service object
        var svc = new Service(svcSettings);
        return new Promise((resolve, reject) => {
            // Listen for the "uninstall" event so we know when it's done.
            svc.on('uninstall',function(){
            console.log('Uninstall complete.');
            console.log('The service exists: ', svc.exists);
            if (!svc.exists)
                resolve();
            else
                reject();
            });
    
            // Uninstall the service.
            svc.uninstall();
        })
    }
}
