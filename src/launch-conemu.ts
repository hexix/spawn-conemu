import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
import * as Commander from "commander";
import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    custom,
    identifier,
    serialize,
    deserialize,
    getDefaultModelSchema,
    setDefaultModelSchema,
    serializable,
    serializeAll
} from 'serializr';

const dfltCfgFileName = "launch-conemu.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
}

export default class {
    public static launch(): number {

        let config = Config.fromFile();
        if (!config) return 1;

        let program = new Commander.Command();

        program
            .version("0.1.0")

        program
            .command("start <setup>")
            .action( (setup) => {
                console.log("start %s", setup);
                return 0;
            });

        program
            .command("list")
            .action( () => {
                config.Setups.forEach(setup => {
                    console.log(setup.Name);
                });
                return 0;
            });

        program.parse(process.argv);

        return 0;
    }
}

@serializeAll
export class CommandArg {
    public ArgValue: string;

    constructor( ) {
    }

    public static getExample(): CommandArg {
        let arg = new CommandArg();
        arg.ArgValue = "arg";
        return arg;
    }
}

export class Task {
    @serializable
    public ExePath: string;
    @serializable
    public StartInCmd: boolean;
    @serializable
    public TabTitle: string;
    @serializable(list(object(CommandArg)))
    public CommandArgs: CommandArg[];

    constructor() {
    }

    public static getExample(): Task {
        let task:Task = new Task();
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

export class Setup {
    @serializable
    public Name: string;
    @serializable
    public WorkingDir: string;
    @serializable(list(object(Task)))
    public Tasks: Task[];

    // TODO: add substitution vars

    constructor() {
    }

    public static getExample(): Setup {
        let setup = new Setup();
        setup.Name = "setup name";
        setup.WorkingDir = "setup working dir";
        setup.Tasks = [
            Task.getExample(),
            Task.getExample()
        ];
        return  setup;
    }

}

export class Config {
    @serializable
    public ComEmuExePath: string;
    @serializable
    public ConfigFile: string;
    @serializable
    public Title: string;
    @serializable
    public IconFile: string;
    @serializable(list(object(Setup)))
    public Setups: Setup[];

    constructor( ) {}

    public static getExample(): Config {
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

    public toSerializedString(): string {
        let srz = serialize(this);
        return JSON.stringify(srz);
    }

    public static fromSerializedString(jsonStr: string) {
        let json = JSON.parse(jsonStr);
        return deserialize(Config, json);
    }

    private static readFile(filepath): Config {
        if (!filepath) throw { error: ErrCodes.NOCFGFILE };
        let configStr = fs.readFileSync(filepath, null);
        let loaded:Config = Config.fromSerializedString(configStr);
        return loaded;
    }

    public static fromFile(configFilePath?: string): Config {
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
            } else {
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

