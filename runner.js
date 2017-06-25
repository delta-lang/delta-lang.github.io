#!/usr/bin/env node

var child_process = require("child_process");

var dir = process.argv[2];
var deltaPath = process.argv[3];
var stdlibImportSearchPathFlag = process.argv[4] || "";

process.chdir(dir);

try {
    child_process.execSync(`${deltaPath} main.delta ${stdlibImportSearchPathFlag}`);
} catch (error) {
    console.log(error.stdout.toString());
    process.exit();
}

try {
    var output = child_process.execSync("./a.out", { timeout: 3000 });
    console.log(output.toString());
} catch (error) {
    console.log(error.toString());
}
