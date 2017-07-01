const fs = require("fs");
const path = require("path");
const lcLib = require("../lib/launch-cmder.js");

describe("serializr", () => {
    test("ToDos", () => {
        
    });
});

describe("Build Config", () => {
    test.only("Just build", () => {
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

        var configStr = config.toSerialized();
        console.log(configStr);

        var andBack = lcLib.Config.fromSerialized(configStr);
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
        console.log(config.toSerialized());
        expect(config).not.toBeUndefined();
    });
});
