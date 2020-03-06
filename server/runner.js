#!/usr/bin/env node

var child_process = require("child_process");

var dir = process.argv[2];
var deltaPath = process.argv[3];
var stdlibImportSearchPathFlag = process.argv[4] || "";

process.chdir(dir);

try {
    var command = [
        deltaPath,
        "main.delta",
        "-B/app/.apt/usr/lib/x86_64-linux-gnu",
        "-static",
        stdlibImportSearchPathFlag
    ];
    child_process.execSync(command.join(' '));
} catch (error) {
    console.log(error.stdout.toString());
    console.log(error.stderr.toString());
    process.exit();
}

try {
    var output = child_process.execSync("./a.out", { timeout: 3000 });
    console.log(output.toString());
} catch (error) {
    console.log(error.toString());
}
