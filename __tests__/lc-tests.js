const fs = require("fs");
const path = require("path");
const lcLib = require("../spawn-conemu.js");

const conEmuRoot = "C:/Users/grego/cmder_mini";
const conEmuExePath = "vendor/conemu-maximus5/ConEmu64.exe";
const conEmuStorageFile = "vendor/conemu-maximus5/ConEmu.xml";
const cmderIconFile = "icons/cmder_blue.ico";

describe("serializr", () => {
    test("ToDos", () => {
        
    });
});

describe("Build Config", () => {
    test("Just build", () => {
        // var arg = lcLib.CommandArg.getExample();
        // var argStr = arg.toSerialized();
        // console.log(argStr);
        // var task = lcLib.Task.getExample();
        // console.log(task.toSerialized());
        // var setup = lcLib.Setup.getExample();
        // console.log(setup.toSerialized());
        var config = lcLib.Config.getExample();
        // console.log(config);
        expect(config).toMatchObject({ "ConEmuExePath": "conemu path" });

        var configSrz = config.toSerializedString();
        console.log(configSrz);
        expect(configSrz).not.toBeUndefined();

        var andBack = lcLib.Config.fromSerializedString(configSrz);
        console.log(andBack);

        expect(andBack).toMatchObject({ "ConEmuExePath": "conemu path" });
    });
});


describe("Load Config", () => {
    test("From No Filename", () => {
        var config = lcLib.Config.fromFile();
        expect(config).not.toBeUndefined();
    });

    test("From Good Filename", () => {
        var configFile = "testConfig.json";
        // console.log("configFile: " + configFile);
        var config = lcLib.Config.fromFile(configFile);
        // console.log(config.toSerializedString());
        expect(config).not.toBeUndefined();
    });
});

describe("Spawn", () => {
    test("Good setup", () => {
        var config = new lcLib.Config();
        config.ConEmuExePath = path.join(conEmuRoot, conEmuExePath);
        config.ConfigFile = path.join(conEmuRoot, conEmuStorageFile);
        config.WindowIconFile = path.join(conEmuRoot, cmderIconFile);
        
        var setup = new lcLib.Setup();
        setup.Name = "platformtest20";
        setup.WorkingDir = "C:/Users/grego/Hexix/PlatformTests/platformtest20";
        setup.Title = "Commander";

        var webWatchTask = new lcLib.Task();
        webWatchTask.TaskExePath = "C:/Program Files/Docker/Docker/resources/bin/docker-compose.exe";
        webWatchTask.TabIconFile = "C:/Program Files/Docker/Docker/resources/bin/docker-compose.exe";
        webWatchTask.TabTitle = "web-watch";
        webWatchTask.Args = [
            "logs",
            "-f",
            "-t",
            "web-watch"
        ];

        var webTask = new lcLib.Task();
        webTask.TaskExePath = "C:/Program Files/Docker/Docker/resources/bin/docker-compose.exe";
        webTask.TabIconFile = "C:/Program Files/Docker/Docker/resources/bin/docker-compose.exe";
        webTask.TabTitle = "web";
        webTask.Args = [
            "logs",
            "-f",
            "-t",
            "web"
        ];

        setup.Tasks.push(webWatchTask);
        setup.Tasks.push(webTask);
        config.Setups.push(setup);

        // config = lcLib.Config.fromFile(); // temporary
        console.log(JSON.stringify(config));

        lcLib.default.DoSpawn(config, "platformtest20")
    });
});
