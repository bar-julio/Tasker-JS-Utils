let address = "temp.active";
let data = "gh";
let error = false;
let message = "";
console.log("address: ", address);
console.log("data: ", data);

/* function readFile(params) {
    let data = [
        { active: true, data: "thisisdata", key: "ab" },
        { active: true, data: "thisisdataoptinal", key: "cd" },
        { active: true, data: "lastdata", key: "ef" },
        { active: false, data: "thisisoff", key: "gh" },
        { active: true, data: "thisison", key: "ij" },
    ];
    return JSON.stringify(data);
}
function writeFile(params, data) {
    console.log("fileName: ", params);
    console.log("data: ", data);
    return undefined;
} */

let result = "None";
let results = [];
let multiple = false;
try {
    let regex = /^([a-z0-9]+)(\.(all|get|add|del|delete|upd|update|active))$/;

    if (regex.test(address)) {
        let arr = address.split(".");
        let fileName = arr[0];
        let operation = arr[1];
        let secondary = undefined;
        if (operation == "upd" || operation == "update" || operation == "add") {
            if (/^.*\|.*$/.test(data)) {
                let arrData = data.split("|");
                data = arrData[0];
                secondary = arrData[1];
            } else {
                throw new Error("Data not ready");
            }
        }
        let rawData = readFile(fileName + ".json");
        let parsed = JSON.parse(rawData);
        let temp;
        switch (operation) {
            case "all":
                let first = true;
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
                let node = { active: true, key: data, data: secondary };
                if (parsed) temp = parsed.push(node);
                else temp = [].push(node);
                writeFile(fileName, JSON.stringify(parsed));
                break;
            case "del":
            case "delete":
                if (parsed) {
                    for (let iterator of parsed) {
                        if (iterator["active"] && iterator["key"] == data) {
                            iterator["active"] = false;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed));
                }
                break;
            case "upd":
            case "update":
                if (parsed) {
                    for (let iterator of parsed) {
                        if (iterator["active"] && iterator["key"] == data) {
                            iterator["data"] = secondary;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed));
                }
                break;
            case "active":
                if (parsed) {
                    for (let iterator of parsed) {
                        if (!iterator["active"] && iterator["key"] == data) {
                            iterator["active"] = true;
                            break;
                        }
                    }
                    writeFile(fileName, JSON.stringify(parsed));
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
    message = ex;
} finally {
    console.log("error: ", error);
    console.log("message: ", message);
    console.log("multiple: ", multiple);
    console.log("result: ", result);
    console.log("results: ", results);
}
