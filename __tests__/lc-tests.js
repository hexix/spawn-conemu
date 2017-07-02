const fs = require("fs");
const path = require("path");
const lcLib = require("../lib/launch-cmder.js");

describe("serializr", () => {
    test("ToDos", () => {
        
    });
});

describe("Build Config", () => {
    test("Just build", () => {
        expect(true).toBeTruthy();
        var arg = lcLib.CommandArg.getExample();
        // var argStr = arg.toSerialized();
        // console.log(argStr);
        // var task = lcLib.Task.getExample();
        // console.log(task.toSerialized());
        // var setup = lcLib.Setup.getExample();
        // console.log(setup.toSerialized());
        var config = lcLib.Config.getExample();
        console.log(config);

        var configSrz = config.toSerializedString();
        console.log(configSrz);

        var andBack = lcLib.Config.fromSerializedString(configSrz);
        console.log(andBack);
    });
});


describe("Load Config", () => {
    test("From Missing File", () => {
        var config = lcLib.Config.fromFile();
        expect(config).toBeUndefined();
    });

    test("From Good Filename", () => {
        var configFile = "testConfig.json";
        console.log("configFile: " + configFile);
        var config = lcLib.Config.fromFile(configFile);
        //console.log(config);
        console.log(config.toSerializedString());
        expect(config).not.toBeUndefined();
    });
});
