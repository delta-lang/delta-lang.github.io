var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
var os = require("os");
var child_process = require("child_process");

var app = express();
app.use(bodyParser.json());

var isProduction = process.env.NODE_ENV === "production";
var importSearchPathFlags = isProduction ? [`-I${process.cwd()}/cx`] : [];
var cxPath = process.argv[2] || process.cwd() + "/cx/cx";

if (child_process.spawnSync(cxPath, ["-help"]).error) {
    console.error(`Invalid path '${cxPath}'`);
    process.exit(1);
} else {
    console.log(`Using '${cxPath}'`);
}

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("/run", cors(corsOptions)); // enable pre-flight request for "/run"

app.post("/run", cors(corsOptions), function(req, res) {
    var dir = os.tmpdir();

    fs.writeFile(dir + "/main.cx", req.body.code, function(error) {
        if (error) {
            console.error(error.stack);
            return res.send(JSON.stringify({ stderr: error.stack }));
        }

        process.chdir(dir); // Run from source directory to keep error messages short.

        var args = [
            "run",
            "main.cx",
            ...importSearchPathFlags
        ];

        child_process.execFile(cxPath, args, { timeout: 5000 }, function(error, stdout, stderr) {
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
