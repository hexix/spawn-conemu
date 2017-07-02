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
// const taskSchema = {
//     factory: context => new Task(),
//     props: {
//         ExePath: primitive(),
//         StartInCmd: primitive(),
//         TabTitle: primitive(),
//         CommandArgs: list(object(CommandArg))
//         // CommandArgs: custom(
//         //     objVal => {
//         //         let json = [];
//         //         let commandArgArr: Array<CommandArg> = objVal as Array<CommandArg>;
//         //         commandArgArr.forEach( commandArg => {
//         //             let commandArgSrz = serialize(commandArg);
//         //             json.push(commandArgSrz);
//         //         });
//         //         // debugger;
//         //         return json;
//         //     },
//         //     json => {
//         //         debugger;
//         //         let task: Task;
//         //         json.Tasks.forEach(commandArgSrz => {
//         //             let commandArg: CommandArg = deserialize(CommandArg, commandArgSrz);
//         //             task.CommandArgs.push(commandArg);
//         //         });
//         //         return task;
//         //     }
//         // )
//     }
// };
// setDefaultModelSchema(Task, taskSchema);
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
// const setupSchema = {
//     factory: context => new Setup(),
//     props: {
//         Name: primitive(),
//         WorkingDir: primitive(),
//         Tasks: list(object(Task))
//         // Tasks: custom(
//         //     objVal => {
//         //         let json = [];
//         //         let taskArr: Array<Task> = objVal as Array<Task>;
//         //         taskArr.forEach( task => {
//         //             let taskSrz = serialize(task);
//         //             json.push(taskSrz);
//         //         });
//         //         // debugger;
//         //         return json;
//         //     },
//         //     json => {
//         //         debugger;
//         //         let setup: Setup;
//         //         json.Setups.forEach(taskSrz => {
//         //             let task: Task = deserialize(Task, taskSrz);
//         //             setup.Tasks.push(task);
//         //         });
//         //         return setup;
//         //     }
//         // )
//     }
// };
// setDefaultModelSchema(Setup, setupSchema);
class Config {
    constructor() { }
    static getExample() {
        let config = new Config();
        config.ComEmuExePath = "comemu path";
        config.IconFile = "icon file";
        config.WorkingDir = "config working dir";
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
            if (!configFilePath) {
                configFilePath = dfltCfgFileName;
            }
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
var CommandArg_1;
// const configSchema = {
//     factory: context => new Config(),
//     props: {
//         ComEmuPath: primitive(),
//         WorkingDir: primitive(),
//         IconFile: primitive(),
//         Setups: list(object(Setup))
//         // Setups: custom(
//         //     objVal => {
//         //         // debugger;
//         //         let json = {
//         //             ComEmuExePath = target.ComEmuExePath
//         //         };
//         //         json.Setups = [];
//         //         let setupArr: Array<Setup> = objVal as Array<Setup>;
//         //         setupArr.forEach( setup => {
//         //             let setupSrz = serialize(setup);
//         //             json.Setups.push(setupSrz);
//         //         });
//         //         return json;
//         //     },
//         //     json => {
//         //         debugger;
//         //         let config: Config;
//         //         if (json.ComEmuExePath) config.ComEmuExePath = json.ComEmuExePath;
//         //         if (json.WorkingDir) config.WorkingDir = json.WorkingDir;
//         //         if (json.IconFile) config.IconFile = json.IconFile;
//         //         json.Setups.forEach(setupSrz => {
//         //             let setup: Setup = deserialize(Setup, setupSrz);
//         //             config.Setups.push(setup);
//         //         });
//         //         return config;
//         //     }
//         // )
//     }
// }
// setDefaultModelSchema(Config, configSchema);
// module LaunchCmderLib {
// }
//# sourceMappingURL=launch-cmder.js.map