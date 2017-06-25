var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
var os = require('os');
var child_process = require("child_process");

var app = express();
app.use(bodyParser.json());

var deltaPath = process.cwd() + "/delta/src/driver/delta";

var corsOptions = {
    origin: "https://delta-lang.github.io",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("/run", cors(corsOptions)); // enable pre-flight request for "/run"
app.post("/run", cors(corsOptions), function(req, res) {
    if (!fs.existsSync("delta")) {
        console.log("ERROR: 'delta' directory doesn't exist, cwd = " + process.cwd());
        return res.send(JSON.stringify({ output: "Internal server error" }));
    }

    var dir = os.tmpdir();
    fs.writeFile(dir + "/main.delta", req.body.code, function(error) {
        if (error) return res.send(JSON.stringify({ output: error.toString() }))
        var output = child_process.execFileSync("./runner.js", [dir.toString(), deltaPath]);
        res.send(JSON.stringify({ output: output.toString() }));
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("Listening on port " + port);
});
