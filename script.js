var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    indentUnit: 4
});
var runButton = document.getElementById("run");
var output = document.getElementById("output");

runButton.onclick = function() {
    output.value = "Running...";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://delta-sandbox.herokuapp.com/run", true);
    xhr.timeout = 5000;
    xhr.ontimeout = function() { output.value = "Timeout"; };
    xhr.onerror = function(error) { output.value = "Error: " + error.message; };
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                output.value = JSON.parse(xhr.response).output;
            } else {
                output.value = "Error: " + xhr.statusText;
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ code: editor.getValue() }));
};
