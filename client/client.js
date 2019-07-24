var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "delta",
    lineNumbers: true,
    indentUnit: 4
});
var widgets = [];
var runButton = document.getElementById("run");
var output = document.getElementById("output");

function highlightError() {
    if (!output.value.match(/main.delta:\d+:\d+: error:.*/)) return; // no error
    var components = output.value.split(":");
    var position = { line: components[1] - 1, ch: components[2] - 1 };
    var errorMessage = output.value.split("\n")[2] + output.value.match(/error:.*/)[0].slice(6);

    var node = document.createElement("div");
    node.appendChild(document.createTextNode(errorMessage));
    node.className = "error";
    widgets.push(editor.addLineWidget(position.line, node, true));
}

function removeErrors() {
    for (var i = 0; i < widgets.length; ++i) widgets[i].clear();
    widgets.length = 0;
}

var outputUpdater;

runButton.onclick = function() {
    removeErrors();
    output.value = "Running...";
    outputUpdater = setInterval(function() {
        output.value += ".";
    }, 1000);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://delta-sandbox.herokuapp.com/run", true);
    xhr.onerror = function(error) {
        clearInterval(outputUpdater);
        output.value = "Error: " + error.message;
    };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            clearInterval(outputUpdater);
            if (xhr.status === 200) {
                output.value = JSON.parse(xhr.response).output;
                highlightError();
            } else {
                output.value = "Error: " + xhr.statusText;
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ code: editor.getValue() }));
};

// Preserve editor contents on page refresh.
window.onbeforeunload = function() {
    localStorage.setItem("delta_sandbox_editor_contents", editor.getValue());
};

window.onload = function() {
    var contents = localStorage.getItem("delta_sandbox_editor_contents");
    if (contents) {
        editor.setValue(contents);
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "examples/hello_world.delta");
        xhr.onreadystatechange = function() {
            editor.setValue(xhr.responseText);
        };
        xhr.send();
    }
};

document.addEventListener("keydown", function(event) {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
        runButton.click();
        event.preventDefault();
    }
});
