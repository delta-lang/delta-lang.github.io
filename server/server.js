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
var deltaPath = process.argv[2] || process.cwd() + "/delta/src/delta/delta";

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
        if (error) return res.send(JSON.stringify({ output: error.toString() }));
        var args = [dir.toString(), deltaPath].concat(importSearchPathFlags);
        var output = child_process.execFileSync(`${__dirname}/runner.js`, args);
        res.send(JSON.stringify({ output: output.toString() }));
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Listening on port " + port);
});
