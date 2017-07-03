import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
import * as Commander from "commander";
import * as pkginfo from "pkginfo";
import * as _ from "underscore";
import { spawn } from "child_process";
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

const dfltCfgFileName = "spawn-conemu.json";
const ErrCodes = {
    NOCFGFILE: "can not find configuration file",
    CANTPARSE: "can not parse configuration file"
}

export default class {
    public static run(config: Config): void {

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
            .action( (setupName) => {
                if (!config) config = Config.fromFile();

                if (!config) {
                    program.help();
                    throw ErrCodes.NOCFGFILE;
                }
                this.DoSpawn(config, setupName);
            });

        program
            .command("list")
            .description("List available Setups")
            .action( () => {
                if (!config) config = Config.fromFile();

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
                if (!config) config = Config.getExample();
                console.log(JSON.stringify(config));
            });

        program.parse(process.argv);

        if (!program.args.length) program.help();
    }

    static DoSpawn(config: Config, setupName: string): void {
        try {
            let setup: Setup = _.findWhere(config.Setups, { Name: setupName });
            if (!setup) throw "Can not find setup named " + setupName;
            let commandStr = this.buildConEmuStr(config, setup);
            let child = spawn(commandStr, [], {
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

        } catch (err) {
            console.error(err);
        }
    }

    private static buildConEmuStr(config: Config, setup: Setup): string {
        let args = "cd " + setup.WorkingDir + " \& "
        args += config.ConEmuExePath;
        args += " /Icon " + config.WindowIconFile;
        args += " /Title \"" + setup.Title + "\"";
        args += " /LoadCfgFile " + config.ConfigFile;
        args += " -runlist ";
        for(let i=0; i<setup.Tasks.length; i++) {
            if (i > 0) args += " \^\|\^\|\^\| ";
            let task = setup.Tasks[i];
            let taskArgs = this.buildTaskArgs(task, i);
            args += taskArgs;
        }
        return args;
    }

// TODO: intelligently set splits based on task.length
    private static getSplit(order: number): string {
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

    private static buildTaskArgs(task: Task, order: number): string {
        let args = "";
        args += task.TaskExePath;

        let consArg = "";

        if (order == 0) consArg += " \"-new_console:";
        else consArg += " \"-cur_console:";

        consArg += this.getSplit(order);
        consArg += "t" + task.TabTitle + "\"";
        args += consArg;

        task.Args.forEach(taskArg => {
            args += " \"" + taskArg + "\"";
        });
        return args;
    }
}

export class Task {
    @serializable
    public TaskExePath: string;
    @serializable
    public TabIconFile: string;
    @serializable
    public TabTitle: string;
    @serializable(list(primitive()))
    public Args: string[];

    constructor() {
        this.Args = [];
    }

    public static getExample(): Task {
        let task:Task = new Task();
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

export class Setup {
    @serializable
    public Name: string;
    @serializable
    public WorkingDir: string;
    @serializable
    public Title: string;
    @serializable(list(object(Task)))
    public Tasks: Task[];

    // TODO: add substitution vars

    constructor() {
        this.Tasks = [];
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
    public ConEmuExePath: string;
    @serializable
    public ConfigFile: string;
    @serializable
    public WindowIconFile: string;
    @serializable(list(object(Setup)))
    public Setups: Setup[];

    constructor( ) {
        this.Setups = [];
    }

    public static getExample(): Config {
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

