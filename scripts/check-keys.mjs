import { readFileSync } from "node:fs";
const tr = JSON.parse(readFileSync("D:/Alparai/messages/tr.json", "utf8"));
console.log("TR.legal.takedownTitle:", JSON.stringify(tr.legal.takedownTitle));
console.log("TR.legal keys count:", Object.keys(tr.legal).length);
console.log("First 10 legal keys:", Object.keys(tr.legal).slice(0, 10));
const en = JSON.parse(readFileSync("D:/Alparai/messages/en.json", "utf8"));
console.log("EN.legal.takedownTitle:", JSON.stringify(en.legal.takedownTitle));
console.log("EN.legal keys count:", Object.keys(en.legal).length);
