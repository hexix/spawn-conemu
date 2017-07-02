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
const Commander = require("commander");
const serializr_1 = require("serializr");
const dfltCfgFileName = "launch-conemu.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
};
class default_1 {
    static launch() {
        let config = Config.fromFile();
        if (!config)
            return 1;
        let program = new Commander.Command();
        program
            .version("0.1.0");
        program
            .command("start <setup>")
            .action((setup) => {
            console.log("start %s", setup);
            return 0;
        });
        program
            .command("list")
            .action(() => {
            config.Setups.forEach(setup => {
                console.log(setup.Name);
            });
            return 0;
        });
        program.parse(process.argv);
        return 0;
    }
}
exports.default = default_1;
let CommandArg = CommandArg_1 = class CommandArg {
    constructor() {
    }
    static getExample() {
        let arg = new CommandArg_1();
        arg.ArgValue = "arg";
        return arg;
    }
};
CommandArg = CommandArg_1 = __decorate([
    serializr_1.serializeAll
], CommandArg);
exports.CommandArg = CommandArg;
class Task {
    constructor() {
    }
    static getExample() {
        let task = new Task();
        task.ExePath = "exe path";
        task.StartInCmd = true,
            task.TabTitle = "tab title";
        task.CommandArgs = [
            CommandArg.getExample(),
            CommandArg.getExample()
        ];
        return task;
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
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(CommandArg)))
], Task.prototype, "CommandArgs", void 0);
exports.Task = Task;
class Setup {
    // TODO: add substitution vars
    constructor() {
    }
    static getExample() {
        let setup = new Setup();
        setup.Name = "setup name";
        setup.WorkingDir = "setup working dir";
        setup.Tasks = [
            Task.getExample(),
            Task.getExample()
        ];
        return setup;
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
    constructor() { }
    static getExample() {
        let config = new Config();
        config.ComEmuExePath = "conemu path";
        config.IconFile = "icon file";
        config.ConfigFile = "config working dir";
        config.Setups = [
            Setup.getExample(),
            Setup.getExample()
        ];
        return config;
    }
    toSerializedString() {
        let srz = serializr_1.serialize(this);
        return JSON.stringify(srz);
    }
    static fromSerializedString(jsonStr) {
        let json = JSON.parse(jsonStr);
        return serializr_1.deserialize(Config, json);
    }
    static readFile(filepath) {
        if (!filepath)
            throw { error: ErrCodes.NOCFGFILE };
        let configStr = fs.readFileSync(filepath, null);
        let loaded = Config.fromSerializedString(configStr);
        return loaded;
    }
    static fromFile(configFilePath) {
        try {
            let homePath = path.join("~", dfltCfgFileName);
            if (fs.exists(homePath)) {
                return this.readFile(homePath);
            }
            if (!configFilePath) {
                configFilePath = dfltCfgFileName;
            }
            if (path.isAbsolute(configFilePath)) {
                return this.readFile(configFilePath);
            }
            else {
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
], Config.prototype, "ConfigFile", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "Title", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "IconFile", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Setup)))
], Config.prototype, "Setups", void 0);
exports.Config = Config;
var CommandArg_1;
//# sourceMappingURL=launch-conemu.js.map