"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const findUp = require("find-up");
const serializr_1 = require("serializr");
const dfltCfgFileName = "launch-cmder.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
};
class CommandArg {
    constructor(argValue) {
        this.ArgValue = argValue;
    }
    toSerialized() {
        debugger;
        return serializr_1.serialize(this);
    }
    static getExample() {
        return new CommandArg("testArg");
    }
}
__decorate([
    serializr_1.serializable
], CommandArg.prototype, "ArgValue", void 0);
exports.CommandArg = CommandArg;
class Task {
    constructor(exePath, startInCmd, tabTitle, commandArgs) {
        serializr_1.getDefaultModelSchema(Task).props['CommandArgs'] = serializr_1.list(serializr_1.object(CommandArg));
        this.ExePath = exePath;
        if (startInCmd)
            this.StartInCmd = startInCmd;
        if (tabTitle)
            this.TabTitle = tabTitle;
        if (commandArgs) {
            this.CommandArgs = commandArgs;
        }
        else {
            this.CommandArgs = [];
        }
    }
    static getExample() {
        return new Task("exe path", true, "tab title", [
            CommandArg.getExample(),
            CommandArg.getExample()
        ]);
    }
    toSerialized() {
        debugger;
        return serializr_1.serialize(this);
    }
}
__decorate([
    serializr_1.serializable
], Task.prototype, "ExePath", void 0);
__decorate([
    serializr_1.serializable
], Task.prototype, "StartInCmd", void 0);
__decorate([
    serializr_1.serializable
], Task.prototype, "TabTitle", void 0);
exports.Task = Task;
class Setup {
    // TODO add substitution vars
    constructor(name, workingDir, tasks) {
        this.Name = name;
        if (workingDir)
            this.WorkingDir = workingDir;
        if (tasks) {
            this.Tasks = tasks;
        }
        else {
            this.Tasks = [];
        }
    }
    static getExample() {
        return new Setup("setup name", "~", [
            Task.getExample(),
            Task.getExample()
        ]);
    }
    toSerialized() {
        debugger;
        return serializr_1.serialize(this);
    }
}
__decorate([
    serializr_1.serializable
], Setup.prototype, "Name", void 0);
__decorate([
    serializr_1.serializable
], Setup.prototype, "WorkingDir", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Task)))
], Setup.prototype, "Tasks", void 0);
exports.Setup = Setup;
class Config {
    constructor(conEmuExePath, workingDir, iconFile, setups) {
        this.ComEmuExePath = conEmuExePath;
        this.WorkingDir = workingDir;
        if (iconFile)
            this.IconFile = iconFile;
        if (setups) {
            this.Setups = setups;
        }
        else {
            this.Setups = [];
        }
    }
    static getExample() {
        return new Config("ConEmu exe path", "workingDir", "icon file path", [
            Setup.getExample(),
            Setup.getExample()
        ]);
    }
    static readFile(filepath) {
        if (!filepath)
            throw { error: ErrCodes.NOCFGFILE };
        debugger;
        let configStr = fs.readFileSync(filepath, "utf8");
        let loaded = serializr_1.deserialize(Config, configStr);
        // return loaded;
        return loaded;
    }
    toSerialized() {
        debugger;
        return serializr_1.serialize(this);
    }
    static fromFile(configFilePath) {
        try {
            if (!configFilePath) {
                configFilePath = dfltCfgFileName;
            }
            debugger;
            if (path.isAbsolute(configFilePath)) {
                return this.readFile(configFilePath);
            }
            else {
                console.log("looking for " + configFilePath);
                console.log("starting in " + process.cwd());
                let filepath = findUp.sync(configFilePath);
                if (filepath) {
                    return this.readFile(filepath);
                }
                else {
                    throw { error: ErrCodes.NOCFGFILE };
                }
            }
        }
        catch (err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
        }
    }
}
__decorate([
    serializr_1.serializable
], Config.prototype, "ComEmuExePath", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "WorkingDir", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "IconFile", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Setup)))
], Config.prototype, "Setups", void 0);
exports.Config = Config;
// module LaunchCmderLib {
// }
//# sourceMappingURL=launch-cmder.js.map