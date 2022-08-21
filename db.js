let instrucion = "+temp.arr.secondary";
let data = "2";
let error = false;
let message = "";
console.log(instrucion);
console.log(data);

try {
    let regex = /^([a-z0-9])+(\.([a-z0-9]+|\[[0-9]+\])){0,1}(\.\[\](\.[a-z0-9]+)?)?$/;
    let op = data == "-" ? "delete" : data && data != "" ? "update" : "read";

    if (regex.test(instrucion)) {
        let inst = instrucion.split(".");
        let fileName = inst[0] + ".json";
        let file = readFile(fileName);

        let jsonRaw = JSON.parse(file);

        let temp;
        let
        for (let i = 1; i < inst.length; i++) {

        }
    } else {
        throw Exception("Instruction unrecognized");
    }
} catch (error) {}
