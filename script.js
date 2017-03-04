var editor = document.getElementById("editor");
var runButton = document.getElementById("run");
var output = document.getElementById("output");

// Handle tab key presses.
editor.onkeydown = function(e) {
    if (e.keyCode == 9 || e.which == 9) {
        e.preventDefault();
        var s = this.selectionStart;
        this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
        this.selectionEnd = s + 1;
    }
};

runButton.onclick = function() {
    output.value = "Running...";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://emil.users.cs.helsinki.fi/run", true);
    xhr.timeout = 5000;
    xhr.ontimeout = function() { output.value = "Timeout"; };
    xhr.onerror = function() { output.value = "Error"; };
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
    xhr.send(JSON.stringify({ code: editor.value }));
};
