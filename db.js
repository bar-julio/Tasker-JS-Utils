var address;
var data;
var error;
var message;
var debug;

error = false;
message = "None";

var result = "None";
var results = [];
var multiple = false;

//functions
function checkIfExists(fileName) {
    $.get(fileName, function (data, textStatus) {
        return textStatus == "success";
    });
}

//--

//main routine

try {
    var regex = /^([a-z0-9]+)(\.(all|get|add|del|delete|upd|update|active))$/;
    if (regex.test(address)) {
        var arr = address.split(".");
        var fileName = global("SD_CARD") + global("Database") + arr[0] + ".json";
        debug = fileName;
        var operation = arr[1];
        var secondary = undefined;
        if (operation == "upd" || operation == "update" || operation == "add") {
            if (/^.*\|.*$/.test(data)) {
                var arrData = data.split("|");
                data = arrData[0];
                secondary = arrData[1];
            } else {
                throw new Error("Data not ready");
            }
        }

        //check if exists
        if (!checkIfExists(fileName)) {
            if (operation == "add") {
                writeFile(fileName, "[]", false);
            } else {
                throw new Error("File doe not exists");
            }
        }
        //--
        var rawData = readFile(fileName);
        var parsed = JSON.parse(rawData);
        var temp;
        switch (operation) {
            case "all":
                var first = true;
                for (const iterator of parsed) {
                    if (iterator["active"]) {
                        if (!first) {
                            temp += "|" + iterator["data"];
                            multiple = true;
                        } else {
                            first = false;
                            temp = iterator["data"];
                        }
                        results.push(iterator["data"]);
                    }
                }
                result = temp;
                break;
            case "get":
                for (const iterator of parsed) {
                    if (iterator["active"] && iterator["key"] == data) {
                        result = iterator["data"];
                        results.push(iterator["data"]);
                        break;
                    }
                }
                break;
            case "add":
                var node = { active: true, key: data, data: secondary };
                if (parsed)
                    if (!parsed.find((x) => x.key == data && x.active)) parsed.push(node);
                    else parsed = [].push(node);
                result = secondary;
                writeFile(fileName, JSON.stringify(parsed), false);
                break;
            case "del":
            case "delete":
                if (parsed) {
                    for (var iterator of parsed) {
                        if (iterator["active"] && iterator["key"] == data) {
                            iterator["active"] = false;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed), false);
                }
                break;
            case "upd":
            case "update":
                if (parsed) {
                    for (var iterator of parsed) {
                        if (iterator["active"] && iterator["key"] == data) {
                            iterator["data"] = secondary;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed), false);
                }
                break;
            case "active":
                if (parsed) {
                    for (var iterator of parsed) {
                        if (!iterator["active"] && iterator["key"] == data) {
                            iterator["active"] = true;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed), false);
                }
                break;
            default:
                result = "None";
                break;
        }
    } else {
        throw new Error("Instruction unrecognized");
    }
} catch (ex) {
    error = true;
    message = "err: " + ex;
}
