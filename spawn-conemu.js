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
const pkginfo = require("pkginfo");
const _ = require("underscore");
const child_process_1 = require("child_process");
const serializr_1 = require("serializr");
const dfltCfgFileName = "spawn-conemu.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
};
class default_1 {
    static run(config) {
        let program = new Commander.Command();
        pkginfo(module, "version");
        let exp = module.exports;
        let usageInfo = "[option] <command>\n\n";
        usageInfo += "\tSpawn ConEmu terminals, with splitting.\n\n";
        usageInfo += "\tLooks for a config file named 'spawn-conemu.json' in:\n";
        usageInfo += "\t\tuser's home directory\n";
        usageInfo += "\t\tcurrent directory\n";
        usageInfo += "\t\t... then progresses up the tree from the current directory";
        program
            .version(exp.version)
            .usage(usageInfo)
            .option("-v, --verbose", "Verbose");
        program
            .command("start <setup>")
            .description("Start Setup named <setup>")
            .action((setupName) => {
            if (!config)
                config = Config.fromFile();
            if (!config) {
                program.help();
                throw ErrCodes.NOCFGFILE;
            }
            this.DoSpawn(config, setupName);
        });
        program
            .command("list")
            .description("List available Setups")
            .action(() => {
            if (!config)
                config = Config.fromFile();
            if (!config) {
                program.help();
                throw ErrCodes.NOCFGFILE;
            }
            config.Setups.forEach(setup => {
                console.log(setup.Name);
            });
        });
        program
            .command("create-config")
            .description("Show a config file skeleton for copy/paste")
            .action(() => {
            if (!config)
                config = Config.getExample();
            console.log(JSON.stringify(config));
        });
        program.parse(process.argv);
        if (!program.args.length)
            program.help();
    }
    static DoSpawn(config, setupName) {
        try {
            let setup = _.findWhere(config.Setups, { Name: setupName });
            if (!setup)
                throw "Can not find setup named " + setupName;
            let commandStr = this.buildConEmuStr(config, setup);
            let child = child_process_1.spawn(commandStr, [], {
                cwd: process.cwd(),
                detached: true,
                shell: true,
                stdio: "ignore"
            })
                .on("close", (code, signal) => {
            })
                .on("error", err => {
                throw err;
            });
            child.unref();
        }
        catch (err) {
            console.error(err);
        }
    }
    static buildConEmuStr(config, setup) {
        let args = "cd " + setup.WorkingDir + " \& ";
        args += config.ConEmuExePath;
        args += " /Icon " + config.WindowIconFile;
        args += " /Title \"" + setup.Title + "\"";
        args += " /LoadCfgFile " + config.ConfigFile;
        args += " -runlist ";
        for (let i = 0; i < setup.Tasks.length; i++) {
            if (i > 0)
                args += " \^\|\^\|\^\| ";
            let task = setup.Tasks[i];
            let taskArgs = this.buildTaskArgs(task, i);
            args += taskArgs;
        }
        return args;
    }
    // TODO: intelligently set splits based on task.length
    static getSplit(order) {
        switch (order) {
            case 0:
                return "";
            case 1:
                return "s1TV";
            case 2:
                return "s1TH";
            case 3:
                return "s2TH";
            case 4:
                return "s2TV";
            case 5:
                return "s3TH";
        }
        return "";
    }
    static buildTaskArgs(task, order) {
        let args = "";
        args += task.TaskExePath;
        let consArg = "";
        if (order == 0)
            consArg += " \"-new_console:";
        else
            consArg += " \"-cur_console:";
        consArg += this.getSplit(order);
        consArg += "t" + task.TabTitle + "\"";
        args += consArg;
        task.Args.forEach(taskArg => {
            args += " \"" + taskArg + "\"";
        });
        return args;
    }
}
exports.default = default_1;
class Task {
    constructor() {
        this.Args = [];
    }
    static getExample() {
        let task = new Task();
        task.TaskExePath = "exe path";
        task.TabIconFile = "tab icon file";
        task.TabTitle = "tab title";
        task.Args = [
            "arg1",
            "arg2"
        ];
        return task;
    }
}
__decorate([
    serializr_1.serializable
], Task.prototype, "TaskExePath", void 0);
__decorate([
    serializr_1.serializable
], Task.prototype, "TabIconFile", void 0);
__decorate([
    serializr_1.serializable
], Task.prototype, "TabTitle", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.primitive()))
], Task.prototype, "Args", void 0);
exports.Task = Task;
class Setup {
    // TODO: add substitution vars
    constructor() {
        this.Tasks = [];
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
    serializr_1.serializable
], Setup.prototype, "Title", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Task)))
], Setup.prototype, "Tasks", void 0);
exports.Setup = Setup;
class Config {
    constructor() {
        this.Setups = [];
    }
    static getExample() {
        let config = new Config();
        config.ConEmuExePath = "conemu path";
        config.WindowIconFile = "window icon file";
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
], Config.prototype, "ConEmuExePath", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "ConfigFile", void 0);
__decorate([
    serializr_1.serializable
], Config.prototype, "WindowIconFile", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Setup)))
], Config.prototype, "Setups", void 0);
exports.Config = Config;
//# sourceMappingURL=spawn-conemu.js.map