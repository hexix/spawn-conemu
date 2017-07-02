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

export class Config {
    @serializable
    public ComEmuExePath: string;
    @serializable
    public WorkingDir: string;
    @serializable
    public IconFile: string;
    @serializable(list(object(Setup)))
    public Setups: Setup[];

    constructor( ) {}

    public static getExample(): Config {
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
