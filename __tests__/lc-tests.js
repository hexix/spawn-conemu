const fs = require("fs");
const path = require("path");
const lcLib = require("../lib/launch-cmder.js");

describe("Build Config", () => {
    test("Just build", () => {
        expect(true).toBeTruthy();
        var config = new lcLib.Config()
        var configStr = config.toSerialized();
        console.log(config);
        console.log(configStr);
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
        expect(config).not.toBeUndefined();
    });
});
