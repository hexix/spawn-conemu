import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    identifier,
    serialize,
    deserialize,
    getDefaultModelSchema,
    serializable,
    serializeAll
} from 'serializr';

const dfltCfgFileName = "launch-cmder.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
}

export class CommandArg {
    @serializable
    public ArgValue: string;

    constructor(
        argValue: string) {
        this.ArgValue = argValue;
    }

    public toSerialized(): string {
        debugger;
        return serialize(this);
    }

    public static getExample(): CommandArg {
        return new CommandArg("testArg");
    }
}

export class Task {
    @serializable
    public ExePath: string;
    @serializable
    public StartInCmd: boolean;
    @serializable
    public TabTitle: string;
    // @serializable(list(object(CommandArg)))
    public CommandArgs: CommandArg[];

    constructor(
        exePath: string,
        startInCmd: boolean,
        tabTitle: string,
        commandArgs: CommandArg[]) {
            getDefaultModelSchema(Task).props['CommandArgs'] = list(object(CommandArg));
            this.ExePath = exePath;
            if (startInCmd) this.StartInCmd = startInCmd;
            if (tabTitle) this.TabTitle = tabTitle;
            if (commandArgs) {
                this.CommandArgs = commandArgs;
            } else {
                this.CommandArgs = [];
            }
    }

    public static getExample(): Task {
        return new Task("exe path", true, "tab title", [
            CommandArg.getExample(),
            CommandArg.getExample()
        ]);
    }

    public toSerialized(): string {
        debugger;
        return serialize(this);
    }

}

export class Setup {
    @serializable
    public Name: string;
    @serializable
    public WorkingDir: string;
    @serializable(list(object(Task)))
    public Tasks: Task[];

    // TODO add substitution vars

    constructor(
        name: string,
        workingDir : string,
        tasks : Task[]) {
            this.Name = name;
            if (workingDir) this.WorkingDir = workingDir;
            if (tasks) {
                this.Tasks = tasks;
            } else {
                this.Tasks = [];
            }
    }

    public static getExample(): Setup {
        return new Setup("setup name", "~", [
            Task.getExample(),
            Task.getExample()
            ]);
    }

    public toSerialized(): string {
        debugger;
        return serialize(this);
    }

}

export class Config {
    @serializable
    public ComEmuExePath: string;
    @serializable
    public WorkingDir: string;
    @serializable
    public IconFile: string;
    @serializable(list(object(Setup)))
    public Setups: Setup[];

    constructor(
        conEmuExePath: string,
        workingDir: string,
        iconFile: string,
        setups: Setup[]) {
            this.ComEmuExePath = conEmuExePath;
            this.WorkingDir = workingDir;
            if (iconFile) this.IconFile = iconFile;
            if (setups) {
                this.Setups = setups;
            } else {
                this.Setups = [];
            }
    }

    public static getExample(): Config {
        return new Config("ConEmu exe path", "workingDir", "icon file path", [
            Setup.getExample(),
            Setup.getExample()
        ])
    }

    private static readFile(filepath): Config {
        if (!filepath) throw { error: ErrCodes.NOCFGFILE };
        debugger;
        let configStr = fs.readFileSync(filepath, "utf8")
        let loaded = deserialize(Config, configStr);
        // return loaded;
        return loaded;
    }

    public toSerialized(): string {
        debugger;
        return serialize(this);
    }

    static fromFile(configFilePath?: string): Config {
        try {
            if (!configFilePath) {
                configFilePath = dfltCfgFileName; 
            }

debugger;
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
