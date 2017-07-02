const fs = require("fs");
const path = require("path");
const lcLib = require("../launch-conemu.js");

describe("serializr", () => {
    test("ToDos", () => {
        
    });
});

describe("Build Config", () => {
    test("Just build", () => {
        var arg = lcLib.CommandArg.getExample();
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
        // console.log(configSrz);
        expect(configSrz).not.toBeUndefined();

        var andBack = lcLib.Config.fromSerializedString(configSrz);
        expect(andBack).toMatchObject({ "ConEmuExePath": "conemu path" });
    });
});


describe("Load Config", () => {
    test.skip("From Missing File", () => {
        var config = lcLib.Config.fromFile();
        expect(config).toBeUndefined();
    });

    test("From Good Filename", () => {
        var configFile = "testConfig.json";
        // console.log("configFile: " + configFile);
        var config = lcLib.Config.fromFile(configFile);
        // console.log(config.toSerializedString());
        expect(config).not.toBeUndefined();
    });
});
