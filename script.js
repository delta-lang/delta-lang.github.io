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

runButton.onclick = function() {
    removeErrors();
    output.value = "Running...";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://delta-sandbox.herokuapp.com/run", true);
    xhr.timeout = 5000;
    xhr.ontimeout = function() { output.value = "Timeout, try again in a while."; };
    xhr.onerror = function(error) { output.value = "Error: " + error.message; };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
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
}

window.onload = function() {
    var contents = localStorage.getItem("delta_sandbox_editor_contents");
    if (contents) editor.setValue(contents);
}
