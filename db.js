var address;
var data;
var error;
var message;
var debug;

error = false;
message = "None";

var dbresult = "None";
var dbresults = [];
var multiple = false;
//main routine

try {
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
                    dbresults.push(iterator["data"]);
                }
            }
            dbresult = temp;
            break;
        case "get":
            for (const iterator of parsed) {
                if (iterator["active"] && iterator["key"] == data) {
                    dbresult = iterator["data"];
                    dbresults.push(iterator["data"]);
                    break;
                }
            }
            break;
        case "add":
            var node = { active: true, key: data, data: secondary };
            if (parsed)
                if (!parsed.find((x) => x.key == data && x.active)) parsed.push(node);
                else throw new Error("Key already exists");
            else parsed = [node];
            dbresult = secondary;
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
            dbresult = "None";
            break;
    }
} catch (ex) {
    error = true;
    message = "err: " + ex;
}
