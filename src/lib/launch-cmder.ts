import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
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

const dfltCfgFileName = "launch-cmder.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
}

@serializeAll
export class CommandArg {
    public ArgValue: string;

    constructor( ) {}

    public toSerialized(): string {
        return serialize(this);
    }

    public static getExample(): CommandArg {
        let arg = new CommandArg();
        arg.ArgValue = "arg";
        return arg;
    }
}

export class Task {
    public ExePath: string;
    public StartInCmd: boolean;
    public TabTitle: string;
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

    public toSerialized(): string {
        return serialize(this);
    }
}

const taskSchema = {
    factory: context => new Task(),
    props: {
        ExePath: primitive(),
        StartInCmd: primitive(),
        TabTitle: primitive(),
        CommandArgs: list(object(CommandArg))
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
setDefaultModelSchema(Task, taskSchema);

export class Setup {
    public Name: string;
    public WorkingDir: string;
    public Tasks: Task[];

    // TODO add substitution vars

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

    public toSerialized(): string {
        return serialize(this);
    }

}

const setupSchema = {
    factory: context => new Setup(),
    props: {
        Name: primitive(),
        WorkingDir: primitive(),
        Tasks: list(object(Task))
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
setDefaultModelSchema(Setup, setupSchema);

export class Config {
    public ComEmuExePath: string;
    public WorkingDir: string;
    public IconFile: string;
    public Setups: Setup[];

    constructor( ) {}

    public static getExample(): Config {
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

    private static readFile(filepath): Config {
        if (!filepath) throw { error: ErrCodes.NOCFGFILE };
        let configStr = JSON.stringify(JSON.parse(fs.readFileSync(filepath, "utf8")));
        let loaded:Config = deserialize(Config, configStr, (err, result) => {
            if (err)
                throw err;
            else {
                return result;
            }
        });
        return loaded;
    }

    public toSerialized(): string {
        return serialize(this);
    }

    public static fromSerialized(json: string) {
        return deserialize(Config, json);
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

const configSchema = {
    factory: context => new Config(),
    props: {
        ComEmuPath: primitive(),
        WorkingDir: primitive(),
        IconFile: primitive(),
        Setups: custom(
            objVal => {
                let json = [];
                let setupArr: Array<Setup> = objVal as Array<Setup>;
                setupArr.forEach( setup => {
                    let setupStr = serialize(setup);
                    json.push(JSON.stringify(setupStr));
                debugger;
                });
                return json;
            },
            json => {
                let config: Config;
                JSON.parse(json).forEach(setupStr => {
                    let setup: Setup = deserialize(Setup, setupStr);
                    config.Setups.push(setup);
                debugger;
                });
                return config;
            }
        )
    }
}
setDefaultModelSchema(Config, configSchema);

// module LaunchCmderLib {

// }
