const fs = require("fs");
const path = require("path");
const lcLib = require("../lib/launch-cmder.js");
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

describe("serializr", () => {
    test.only("ToDos", () => {
        
    });
});

describe("Build Config", () => {
    test("Just build", () => {
        expect(true).toBeTruthy();
        var config = lcLib.Config.getExample();
        console.log(config.toSerialized());
        var setup = lcLib.Setup.getExample();
        console.log(setup.toSerialized());
        var task = lcLib.Task.getExample();
        console.log(task.toSerialized());
        var arg = lcLib.CommandArg.getExample();
        console.log(arg.toSerialized());
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
        // console.log(config);
        // console.log(config.toSerialized());
        expect(config).not.toBeUndefined();
    });
});
