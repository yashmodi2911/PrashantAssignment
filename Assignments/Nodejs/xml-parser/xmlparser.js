var fs = require("fs");
var parse = require("xml-parser");
var inspect = require("util").inspect;

const path = "./dataa.xml";

try {
  const xmlData = fs.readFileSync(path, "utf8");
  console.log("File content:", xmlData);

  var obj = parse(xmlData);
  console.log(inspect(obj, { colors: true, depth: Infinity }));
} catch (err) {
    console.log("hi")
  console.error(err);
}
