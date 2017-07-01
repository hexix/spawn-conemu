import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
import {Serializable, TsSerializer} from "ts-json-serializer"

const dfltCfgFileName = "launch-cmder.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
}

@Serializable()
export class Task {
    public StartInCmd: boolean;

    public ExePath: string;

    public TabTitle: string;

    public Args: string[];

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
}

@Serializable()
export class Config {
    CmderExePath: string;
    WorkingDir: string;
    IconFile: string;
    Tasks: Task[];

    constructor(
        exePath: string = "full Cmder executable path",
        workingDir: string = "directory in which to operate",
        iconFile?: string
        ) {
            this.CmderExePath = exePath;
            this.WorkingDir = workingDir;
            if (iconFile) {
                this.IconFile = iconFile;
            }
            this.Tasks = [new Task()];
    }

    private static readFile(filepath): Config {
        if (!filepath) throw { error: ErrCodes.NOCFGFILE };
        debugger;
        let configStr = fs.readFileSync(filepath, "utf8")
        const deserializer = new TsSerializer();
        let loaded = deserializer.deserialize<Config>(configStr);
        return loaded;
    }

    public toSerialized(): string {
        debugger;
        const serializer = new TsSerializer();
        return serializer.serialize(this);
    }

    static fromFile(configFilePath?: string): Config {
        try {
            if (!configFilePath) {
                configFilePath = dfltCfgFileName; 
            }

            if (path.isAbsolute(configFilePath)) {
                return this.readFile(configFilePath);
            } else {
                console.log("looking for " + configFilePath);
                console.log("starting in " + process.cwd());
                let filepath = findUp.sync(configFilePath)
                if (filepath) {
                    return this.readFile(filepath);
                } else {
                    throw { error: ErrCodes.NOCFGFILE };
                }
            }
        } catch (err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
        }
    }
}

// module LaunchCmderLib {

// }
