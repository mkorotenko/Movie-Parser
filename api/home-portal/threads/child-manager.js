const exec = require('child_process').exec;
const psTree = require('ps-tree');

var kill = function (pid, signal, callback) {
    signal = signal || 'SIGKILL';
    callback = callback || function () { };
    var killTree = true;
    if (killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                try { process.kill(tpid, signal) }
                catch (ex) { }
            });
            callback();
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback();
    }
};

function createChildProcess(name, path, parameters) {

    this.name = name;
    this.path = path;
    this.parameters = parameters || {};
    this.running = false;

}

createChildProcess.prototype.onError = function (error) {
    console.error(`Error Child "${this.name}":`, error);
}

createChildProcess.prototype.onMessage = function (message) {
    //console.error(`Child "${this.name}":`, message);
}

createChildProcess.prototype.onExit = function (code) {
    this.running = false;
    console.error(`Child "${this.name}" exit:`, code);
    this.afterStop();
}

createChildProcess.prototype.onClose = function (code) {
    this.running = false;
    console.error(`Child "${this.name}" close:`, code);
    this.afterStop();
}

createChildProcess.prototype.run = function () {
    if (!this.running) {

        this.beforeStart();

        const childProcess = this.process = exec(this.path, this.parameters, (err, stdout, stderr) => {
            if (err) {
                this.running = false;
                this.onError(err);
                return;
            }
            this.onMessage(stdout)
        });
    
        childProcess.on('exit', this.onExit.bind(this));
    
        childProcess.on('close', this.onClose.bind(this));
    
        childProcess.stdout.on('data', this.onMessage.bind(this));
    
        childProcess.stderr.on('data', this.onError.bind(this));

    }
}

createChildProcess.prototype.kill = function () {
    if (this.running)
        kill(this.process.pid);
}

createChildProcess.prototype.beforeStart = function () {}
createChildProcess.prototype.afterStop = function () {}

module.exports = createChildProcess
