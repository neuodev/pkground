import { transformSync } from "@babel/core";

console.log(transformSync("const he = () => {}"));
