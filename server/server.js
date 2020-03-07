var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
var os = require("os");
var child_process = require("child_process");

var app = express();
app.use(bodyParser.json());

var isProduction = process.env.NODE_ENV === "production";
var importSearchPathFlags = isProduction ? [`-I${process.cwd()}/delta`] : [];
var deltaPath = process.argv[2] || process.cwd() + "/delta/delta";

if (child_process.spawnSync(deltaPath, ["-help"]).error) {
    console.error(`Invalid path '${deltaPath}'`);
    process.exit(1);
} else {
    console.log(`Using '${deltaPath}'`);
}

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("/run", cors(corsOptions)); // enable pre-flight request for "/run"

app.post("/run", cors(corsOptions), function(req, res) {
    var dir = os.tmpdir();

    fs.writeFile(dir + "/main.delta", req.body.code, function(error) {
        if (error) {
            console.error(error.stack);
            return res.send(JSON.stringify({ stderr: error.stack }));
        }

        process.chdir(dir); // Run from source directory to keep error messages short.

        var args = [
            "run",
            "main.delta",
            "-B/app/.apt/usr/lib/x86_64-linux-gnu",
            "-static",
            ...importSearchPathFlags
        ];

        child_process.execFile(deltaPath, args, { timeout: 5000 }, function(error, stdout, stderr) {
            if (error) {
                console.error(error.stack);

                if ((!stdout || !stdout.toString()) && (!stderr && !stderr.toString())) {
                    return res.send(JSON.stringify({ stderr: error.stack }));
                }
            }

            res.send(JSON.stringify({
                stdout: stdout.toString(),
                stderr: stderr.toString()
            }));
        });
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Listening on port " + port);
});
