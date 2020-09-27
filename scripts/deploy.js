const fs = require('fs'),
    ncp = require('ncp').ncp;

let source = process.env.DIST,
    targ = process.env.TARG;

// In case if
// deploy -p DIST=\"f:/...." TARG=\"d:/..."
if (!source && !targ && process.env.npm_config_argv) {
    const npm_config_argv = JSON.parse(process.env.npm_config_argv);
    const args = npm_config_argv.remain;
    const distVal = args.find(item => item.substr(0,4) === 'DIST');
    const targVal = args.find(item => item.substr(0,4) === 'TARG');
    if (distVal && targVal) {
        source = distVal.replace('DIST=', '');
        targ = targVal.replace('TARG=', '');
    }
}

if (!targ) {
    throw new Error(`Targed folder not defined.`);
}
console.info('Deploy started: ', targ);

if (!source || !fs.existsSync(source)) {
    throw new Error(`Dist folder does not exists: ${source}`);
}

if (!fs.existsSync(targ)) {
    fs.mkdirSync(targ);
}

fs.rmdir(targ, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }

    fs.mkdirSync(targ);
    ncp.limit = 16;
    // ncp(source, destination, callback)  
    ncp(source, targ, (err) => { 
        if (err) { 
            throw(err); 
        } 
      
        console.info('Deploy completed');
    });
    console.info('Deploy copying files...');
});

console.info('Deploy deleting files...');
