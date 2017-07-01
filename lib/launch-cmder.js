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
    constructor() { }
    toSerialized() {
        return serializr_1.serialize(this);
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
    toSerialized() {
        return serializr_1.serialize(this);
    }
}
exports.Task = Task;
const taskSchema = {
    factory: context => new Task(),
    props: {
        ExePath: serializr_1.primitive(),
        StartInCmd: serializr_1.primitive(),
        TabTitle: serializr_1.primitive(),
        CommandArgs: serializr_1.list(serializr_1.object(CommandArg))
        // CommandArgs: custom(
        //     objVal => {
        //         let json = [];
        //         let commandArgArr: Array<CommandArg> = objVal as Array<CommandArg>;
        //         commandArgArr.forEach( commandArg => {
        //             let commandArgStr = serialize(commandArg);
        //             json.push(commandArgStr);
        //         });
        //         debugger;
        //         return json;
        //     },
        //     json => {}
        // )
    }
};
serializr_1.setDefaultModelSchema(Task, taskSchema);
class Setup {
    // TODO add substitution vars
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
    toSerialized() {
        return serializr_1.serialize(this);
    }
}
exports.Setup = Setup;
const setupSchema = {
    factory: context => new Setup(),
    props: {
        Name: serializr_1.primitive(),
        WorkingDir: serializr_1.primitive(),
        Tasks: serializr_1.list(serializr_1.object(Task))
        // Tasks: custom(
        //     objVal => {
        //         let json = [];
        //         let taskArr: Array<Task> = objVal as Array<Task>;
        //         taskArr.forEach( task => {
        //             let taskStr = serialize(task);
        //             json.push(taskStr);
        //         });
        //         debugger;
        //         return json;
        //     },
        //     json => {})
    }
};
serializr_1.setDefaultModelSchema(Setup, setupSchema);
class Config {
    constructor() { }
    static getExample() {
        let config = new Config();
        config.ComEmuExePath = "comemu path";
        config.IconFile = "icon file";
        config.WorkingDir = "task working dir";
        config.Setups = [
            Setup.getExample(),
            Setup.getExample()
        ];
        return config;
    }
    static readFile(filepath) {
        if (!filepath)
            throw { error: ErrCodes.NOCFGFILE };
        let configStr = JSON.stringify(JSON.parse(fs.readFileSync(filepath, "utf8")));
        let loaded = serializr_1.deserialize(Config, configStr, (err, result) => {
            if (err)
                throw err;
            else {
                return result;
            }
        });
        return loaded;
    }
    toSerialized() {
        return serializr_1.serialize(this);
    }
    static fromSerialized(json) {
        return serializr_1.deserialize(Config, json);
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
exports.Config = Config;
const configSchema = {
    factory: context => new Config(),
    props: {
        ComEmuPath: serializr_1.primitive(),
        WorkingDir: serializr_1.primitive(),
        IconFile: serializr_1.primitive(),
        Setups: serializr_1.custom(objVal => {
            let json = [];
            let setupArr = objVal;
            setupArr.forEach(setup => {
                let setupStr = serializr_1.serialize(setup);
                json.push(JSON.stringify(setupStr));
                debugger;
            });
            return json;
        }, json => {
            let config;
            JSON.parse(json).forEach(setupStr => {
                let setup = serializr_1.deserialize(Setup, setupStr);
                config.Setups.push(setup);
                debugger;
            });
            return config;
        })
    }
};
serializr_1.setDefaultModelSchema(Config, configSchema);
var CommandArg_1;
// module LaunchCmderLib {
// }
//# sourceMappingURL=launch-cmder.js.map