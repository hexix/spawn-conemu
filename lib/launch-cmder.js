"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const findUp = require("find-up");
const ts_json_serializer_1 = require("ts-json-serializer");
const dfltCfgFileName = "launch-cmder.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
};
let Task = class Task {
    // constructor(
    //     inCmd: boolean,
    //     exePath: string,
    //     title: string,
    //     args: string[]) {
    //         this.StartInCmd = inCmd;
    //         this.ExePath = exePath;
    //         this.TabTitle = title;
    //         this.Args = args;
    // }
    constructor() {
    }
};
Task = __decorate([
    ts_json_serializer_1.Serializable(),
    __metadata("design:paramtypes", [])
], Task);
exports.Task = Task;
let Config = class Config {
    constructor(exePath = "full Cmder executable path", workingDir = "directory in which to operate", iconFile) {
        this.CmderExePath = exePath;
        this.WorkingDir = workingDir;
        if (iconFile) {
            this.IconFile = iconFile;
        }
        this.Tasks = [new Task()];
    }
    static readFile(filepath) {
        if (!filepath)
            throw { error: ErrCodes.NOCFGFILE };
        debugger;
        let configStr = fs.readFileSync(filepath, "utf8");
        const deserializer = new ts_json_serializer_1.TsSerializer();
        let loaded = deserializer.deserialize(configStr);
        return loaded;
    }
    toSerialized() {
        debugger;
        const serializer = new ts_json_serializer_1.TsSerializer();
        return serializer.serialize(this);
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
};
Config = __decorate([
    ts_json_serializer_1.Serializable(),
    __metadata("design:paramtypes", [String, String, String])
], Config);
exports.Config = Config;
// module LaunchCmderLib {
// }
//# sourceMappingURL=launch-cmder.js.map