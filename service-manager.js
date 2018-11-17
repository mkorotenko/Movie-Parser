var Service = require('node-windows').Service;
// Create a new service object
var svcSettings = {
    name:'Home portal',
    description: 'Home web server.',
    script: require('path').join(__dirname, 'dist-server.js'),
    env: [{
            name: "PORT",
            value: 80
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
                console.log(svc.name+' started!\nVisit http://192.168.1.104');
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
