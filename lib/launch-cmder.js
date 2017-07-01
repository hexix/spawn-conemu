const fs = require("fs");

exports.LaunchCmderLib = LaunchCmderLib = function launchCmderLib() {

}

LaunchCmderLib.prototype.LoadConfig = function loadConfig(filePath) {
    if (filePath) {
        if (!fs.existsSync(filePath)) {
            throw { error: "specified file does not exist" };
        }
    } else {
        filePath = process.cwd;
    }

    
}